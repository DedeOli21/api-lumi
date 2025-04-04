import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import pdf from 'pdf-parse';
import { IInvoiceRepository } from 'src/Domain/Interfaces/invoice.repositories';
import { InvoiceData } from 'src/Application/interfaces/invoice.interface';
import { IClientRepository } from 'src/Domain/Interfaces/client.repositories';
import { Invoice } from 'src/Domain/Entities/invoice.entity';
import {
  extractInvoiceDataFromText,
  saveInvoicePdf,
} from 'src/Shared/Utils/text-match.helper';

@Injectable()
export class InvoicesService {
  constructor(
    private clientRepo: IClientRepository,
    private invoiceRepo: IInvoiceRepository,
  ) {}

  async extractInvoiceData(fileBuffer: Buffer): Promise<InvoiceData> {
    const data = await pdf(fileBuffer);

    const text = data.text;

    try {
      return extractInvoiceDataFromText(text);
    } catch (error) {
      console.error('Error extracting data:', error.message);
      throw new BadRequestException(
        'Erro ao processar PDF: formato inválido ou dados faltantes',
      );
    }
  }

  async processAndSaveInvoice(fileBuffer: Buffer) {
    try {
      const data = await this.extractInvoiceData(fileBuffer);

      let client = await this.clientRepo.findByClientNumber(data.clientNumber);

      if (!client) {
        client = await this.clientRepo.create(
          data.clientNumber,
          `Cliente ${data.clientNumber}`,
        );
      }

      const fullPath = await saveInvoicePdf(fileBuffer, data);

      const payload = {
        ...data,
        clientId: client.id,
        pdfPath: fullPath,
      };

      return this.invoiceRepo.create(payload);
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new BadRequestException(
        'Erro ao processar PDF: formato inválido ou dados faltantes',
      );
    }
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findById(id);

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    if (!invoice.pdfPath) {
      throw new NotFoundException('Arquivo PDF da fatura não encontrado');
    }

    return invoice;
  }

  async findFiltered(
    clientId?: number,
    month?: string,
    year?: string,
  ): Promise<Invoice[]> {
    return this.invoiceRepo.findFiltered(clientId, month, year);
  }

  async getAvailableYears(): Promise<any> {
    return this.invoiceRepo.getAvailableYears();
  }

  async getAvailableMonths(year: string, clientId?: number): Promise<any> {
    return this.invoiceRepo.getAvailableMonths(year, clientId);
  }
}
