import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/Domain/Entities/invoice.entity';
import { IInvoiceRepository } from 'src/Domain/Interfaces/invoice.repositories';
import { createInvoiceDTO } from 'src/Presentation/DTOs/create-invoice.dto';
import { getMonthName } from 'src/Shared/Utils/get-month.helpert';
import { Repository } from 'typeorm';

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
      .where('invoice.monthReference LIKE :year', { year: `%/${year}` });

    if (clientId) {
      query.andWhere('invoice.clientId = :clientId', { clientId: Number(clientId) });
    }

    return await query
      .orderBy('"invoice"."monthReference"', 'ASC')
      .getRawMany();
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

  create(invoice: createInvoiceDTO): Promise<Invoice> {
    const result = this.invoiceRepo.create(invoice);

    return this.invoiceRepo.save(result);
  }

  findFiltered(
    clientId?: number,
    month?: string,
    year?: string,
  ): Promise<Invoice[]> {

    if (month) {
       month = getMonthName(month);
    }
    const query = this.invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.client', 'client');

    if (clientId) query.andWhere('invoice.clientId = :clientId', { clientId });

    if (month && year) {
      query.andWhere('invoice.monthReference = :month', {
        month: `${month}/${year}`,
      });
    }

    return query.orderBy('invoice.createdAt', 'DESC').getMany();
  }
}
