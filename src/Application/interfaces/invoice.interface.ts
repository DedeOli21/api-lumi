export interface InvoiceData {
  clientNumber: string;
  monthReference: string;
  energyConsumptionKwh: number;
  energyCompensatedKwh: number;
  totalValueWithoutGd: number;
  gdEconomyValue: number;
}