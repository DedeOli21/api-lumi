import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "src/Domain/Entities/invoice.entity";
import { IInvoiceRepository } from "src/Domain/Interfaces/invoice.repositories";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
    constructor(
        private invoiceRepo: IInvoiceRepository,
    ) {}

    async getDashboard(clientId: number) {
        const invoices = await this.invoiceRepo.findByClientId(clientId);
      
        const summary = {
          totalKwh: 0,
          totalCompensated: 0,
          valueWithoutGd: 0,
          gdEconomy: 0,
        };
      
        const graphData = invoices.map((inv) => {
          summary.totalKwh += inv.energyConsumptionKwh;
          summary.totalCompensated += inv.energyCompensatedKwh;
          summary.valueWithoutGd += Number(inv.totalValueWithoutGd || 0);
          summary.gdEconomy += Number(inv.gdEconomyValue || 0);
      
          return {
            monthReference: inv.monthReference,
            energyConsumptionKwh: inv.energyConsumptionKwh,
            energyCompensatedKwh: inv.energyCompensatedKwh,
            totalValueWithoutGd: Number(inv.totalValueWithoutGd || 0),
            gdEconomyValue: Number(inv.gdEconomyValue || 0),
          };
        });
      
        return { summary, graphData };
      }
      
}