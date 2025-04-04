import { Invoice } from "../Entities/invoice.entity";

export abstract class IInvoiceRepository {
    findFiltered: (clientId?: number, month?: string, year?: string) => Promise<Invoice[]>;
    create: (invoice: any) => Promise<Invoice[]>;
    findById: (id: number) => Promise<Invoice | null>;
    findByClientId: (clientId: number) => Promise<Invoice[] | null>;
    getAvailableYears: () => Promise<{ monthReference: string }[]>;
    getAvailableMonths: (year: string, clientId?: number) => Promise<{ monthReference: string }[]>;
}