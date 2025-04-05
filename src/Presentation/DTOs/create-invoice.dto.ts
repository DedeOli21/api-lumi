export interface createInvoiceDTO {
  clientNumber: string;
  monthReference: string;
  energyConsumptionKwh: number;
  energyCompensatedKwh: number;
  totalValueWithoutGd: number;
  gdEconomyValue: number;
  clientId: number;
  pdfPath: string;
}