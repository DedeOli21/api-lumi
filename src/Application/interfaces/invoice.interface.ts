export interface InvoiceData {
  clientName: string;
  clientNumber: string;
  monthReference: string;
  energyConsumptionKwh: number;
  energyCompensatedKwh: number;
  totalValueWithoutGd: number;
  gdEconomyValue: number;
}
