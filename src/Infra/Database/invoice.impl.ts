import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "src/Domain/Entities/invoice.entity";
import { IInvoiceRepository } from "src/Domain/Interfaces/invoice.repositories";
import { Repository } from "typeorm";

export class InvoiceImpl implements IInvoiceRepository {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepo: Repository<Invoice>,
    ) {}

    async getAvailableYears(): Promise<{ monthReference: string }[]> {
        return this.invoiceRepo
            .createQueryBuilder('invoice')
            .select('DISTINCT "invoice"."monthReference"', 'monthReference')
            .orderBy('"invoice"."monthReference"', 'DESC')
            .getRawMany();
    }

    async getAvailableMonths(year: string, clientId?: number) {
        const query = this.invoiceRepo
          .createQueryBuilder('invoice')
          .select('DISTINCT "invoice"."monthReference"', 'monthReference')
          .where("invoice.monthReference LIKE :year", { year: `%/${year}` });
      
        if (clientId) {
          query.andWhere('invoice.clientId = :clientId', { clientId });
        }
      
        return await query.orderBy('"invoice"."monthReference"', 'ASC').getRawMany();
    }

    findById(id: number): Promise<Invoice | null> {
        return this.invoiceRepo.findOne({ where: { id } });
    }

    findByClientId(clientId: number): Promise<Invoice[]> {
      return this.invoiceRepo.find({
        where: { client: { id: clientId } },
        order: { monthReference: 'ASC' },
      });
    }

    create(invoice: any): Promise<Invoice[]> {
        const result = this.invoiceRepo.create(invoice);

          return this.invoiceRepo.save(result);
    }

    findFiltered(clientId?: number, month?: string, year?: string): Promise<Invoice[]> {
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

}