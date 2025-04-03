import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { Invoice } from '../entities/invoice.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface InvoiceData {
  clientNumber: string;
  monthReference: string;
  energyConsumptionKwh: number;
  energyCompensatedKwh: number;
  totalValueWithoutGd: number;
  gdEconomyValue: number;
}

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,

    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
  ) {}

  async extractInvoiceData(fileBuffer: Buffer): Promise<InvoiceData> {
    const data = await pdf(fileBuffer);

    const text = data.text;

    try {
      const clientNumber = text.match(/(\d{10})\s+\d{10}/)?.[1];

      const monthReference = text.match(/Referente[\s\S]*?\b([A-Z]{3}\/\d{4})\b/)?.[1];

      const energyElectricKwh = Number(text.match(/Energia Elétrica.*?kWh\s+(\d+)/i)?.[1] || 0);
      const energySceeeKwh = Number(text.match(/Energia SCEE s\/ ICMS.*?kWh\s+(\d+)/i)?.[1] || 0);
      const energyCompensatedKwh = Number(text.match(/Energia compensada GD I.*?kWh\s+(\d+)/i)?.[1] || 0);

      const energyElectricValue = Number(
        text.match(/Energia Elétrica.*?([\d.,-]+)\s*$/im)?.[1]?.replace('.', '').replace(',', '.') || '0'
      );
      
      const energySceeeValue = Number(
        text.match(/Energia SCEE s\/ ICMS.*?([\d.,-]+)\s*$/im)?.[1]?.replace('.', '').replace(',', '.') || '0'
      );
      const ilumPublicValue = Number(
        text.match(/Contrib Ilum Publica Municipal\s+([\d.,]+)/i)?.[1]?.replace('.', '').replace(',', '.') || '0'
      );

      const gdEconomyValue = Number(
        text.match(/Energia compensada GD I.*?(-?[\d.,]+)\s*$/im)?.[1]?.replace('.', '').replace(',', '.') || '0'
      );

      if (!clientNumber) throw new Error('clientNumber não encontrado');
      if (!monthReference) throw new Error('monthReference não encontrado');

      const energyConsumptionKwh = energyElectricKwh + energySceeeKwh;
      const totalValueWithoutGd = energyElectricValue + energySceeeValue + ilumPublicValue;

      return {
        clientNumber,
        monthReference,
        energyConsumptionKwh,
        energyCompensatedKwh,
        totalValueWithoutGd,
        gdEconomyValue,
      };
    } catch (error) {
      console.error('Error extracting data:', error.message);
      throw new BadRequestException('Erro ao processar PDF: formato inválido ou dados faltantes');
    }
  }

  async findFiltered(clientId?: number, month?: string, year?: string): Promise<Invoice[]> {
    // converter month e year para o formato ex: "JAN/2024 atualmente estou recebendo year como "2024" e month como "02"

    // se o mês for 02, converta para "FEV" ou qualquer outro mes que você queira

    if (month) {
      const monthMap: { [key: string]: string } = {
        '01': 'JAN',
        '02': 'FEV',
        '03': 'MAR',
        '04': 'ABR',
        '05': 'MAI',
        '06': 'JUN',
        '07': 'JUL',
        '08': 'AGO',
        '09': 'SET',
        '10': 'OUT',
        '11': 'NOV',
        '12': 'DEZ',
      };
      month = monthMap[month] || month;
    }

    console.log('findFiltered called with clientId:', clientId, 'month:', month, 'year:', year);
    const query = this.invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client');

    if (clientId) query.andWhere('invoice.clientId = :clientId', { clientId });

    if (month && year) {
      query.andWhere("invoice.monthReference = :month", { month: `${month}/${year}` });
    }
  

    return query.orderBy('invoice.createdAt', 'DESC').getMany();
  }

  async processAndSaveInvoice(fileBuffer: Buffer) {
    try {
      const data = await this.extractInvoiceData(fileBuffer);

      let client = await this.clientRepo.findOne({ where: { clientNumber: data.clientNumber } });

      console.log

      if (!client) {
        client = this.clientRepo.create({
          clientNumber: data.clientNumber,
          name: `Cliente ${data.clientNumber}`,
        });
        await this.clientRepo.save(client);
      }

      const sanitizedMonthRef = data.monthReference.replace('/', '-');
      const fileName = `${data.clientNumber}-${sanitizedMonthRef}.pdf`;
      const fileDir = path.resolve(__dirname, '..', '..', 'uploads', 'invoices');
      const fullPath = path.join(fileDir, fileName);
  
      // Cria a pasta caso não exista
      await fs.promises.mkdir(fileDir, { recursive: true });
  
      // Salva o arquivo no disco
      await fs.promises.writeFile(fullPath, fileBuffer);

      const invoice = this.invoiceRepo.create({
        ...data,
        clientId: client.id,
        pdfPath: fullPath,
      });

      return this.invoiceRepo.save(invoice);
      } catch (error) {
        console.error('Error processing PDF:', error);
        throw new BadRequestException('Erro ao processar PDF: formato inválido ou dados faltantes');
        
      }
  }

  async getAvailableYears(): Promise<{ monthReference: string }[]> {
    return this.invoiceRepo
      .createQueryBuilder('invoice')
      .select('DISTINCT "invoice"."monthReference"', 'monthReference')
      .orderBy('"invoice"."monthReference"', 'DESC')
      .getRawMany();
  }
  
  async getAvailableMonths(year: string, clientId?: number) {

    console.log('getAvailableMonths called with year:', year, 'and clientId:', clientId);
    const query = this.invoiceRepo
      .createQueryBuilder('invoice')
      .select('DISTINCT "invoice"."monthReference"', 'monthReference')
      .where("invoice.monthReference LIKE :year", { year: `%/${year}` });
  
    if (clientId) {
      query.andWhere('invoice.clientId = :clientId', { clientId });
    }
  
    return await query.orderBy('"invoice"."monthReference"', 'ASC').getRawMany();
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
    });
  
    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }
  
    if (!invoice.pdfPath) {
      throw new NotFoundException('Arquivo PDF da fatura não encontrado');
    }
  
    return invoice;
  }
  

}
