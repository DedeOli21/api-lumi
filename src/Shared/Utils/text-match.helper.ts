import { InvoiceData } from 'src/Application/interfaces/invoice.interface';
import * as fs from 'fs';
import * as path from 'path';

export function extractInvoiceDataFromText(text: string): InvoiceData {
  const clientNumber = text.match(/(\d{10})\s+\d{10}/)?.[1];
  const monthReference = text.match(
    /Referente[\s\S]*?\b([A-Z]{3}\/\d{4})\b/,
  )?.[1];

  const energyElectricKwh = Number(
    text.match(/Energia Elétrica.*?kWh\s+(\d+)/i)?.[1] || 0,
  );
  const energySceeeKwh = Number(
    text.match(/Energia SCEE s\/ ICMS.*?kWh\s+(\d+)/i)?.[1] || 0,
  );
  const energyCompensatedKwh = Number(
    text.match(/Energia compensada GD I.*?kWh\s+(\d+)/i)?.[1] || 0,
  );

  const energyElectricValue = Number(
    text
      .match(/Energia Elétrica.*?([\d.,-]+)\s*$/im)?.[1]
      ?.replace('.', '')
      .replace(',', '.') || '0',
  );

  const energySceeeValue = Number(
    text
      .match(/Energia SCEE s\/ ICMS.*?([\d.,-]+)\s*$/im)?.[1]
      ?.replace('.', '')
      .replace(',', '.') || '0',
  );

  const ilumPublicValue = Number(
    text
      .match(/Contrib Ilum Publica Municipal\s+([\d.,]+)/i)?.[1]
      ?.replace('.', '')
      .replace(',', '.') || '0',
  );

  const gdEconomyValue = Number(
    text
      .match(/Energia compensada GD I.*?(-?[\d.,]+)\s*$/im)?.[1]
      ?.replace('.', '')
      .replace(',', '.') || '0',
  );

  if (!clientNumber) throw new Error('clientNumber não encontrado');
  if (!monthReference) throw new Error('monthReference não encontrado');

  const energyConsumptionKwh = energyElectricKwh + energySceeeKwh;
  const totalValueWithoutGd =
    energyElectricValue + energySceeeValue + ilumPublicValue;

  return {
    clientNumber,
    monthReference,
    energyConsumptionKwh,
    energyCompensatedKwh,
    totalValueWithoutGd,
    gdEconomyValue,
  };
}

export async function saveInvoicePdf(
  fileBuffer: Buffer,
  data: InvoiceData,
): Promise<string> {
  const sanitizedMonthRef = data.monthReference.replace('/', '-');
  const fileName = `${data.clientNumber}-${sanitizedMonthRef}.pdf`;
  const fileDir = path.resolve(__dirname, '..', '..', 'uploads', 'invoices');
  const fullPath = path.join(fileDir, fileName);

  await fs.promises.mkdir(fileDir, { recursive: true });
  await fs.promises.writeFile(fullPath, fileBuffer);

  return fullPath;
}
