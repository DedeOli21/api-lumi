import {
  Controller,
  Get,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesService } from '../../Application/Services/invoices/invoices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';
import { Invoice } from 'src/Domain/Entities/invoice.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async findFiltered(
    @Query('client_id') clientId?: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<Invoice[]> {
    return this.invoicesService.findFiltered(clientId, month, year);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.invoicesService.processAndSaveInvoice(file.buffer);
  }

  @Get(':id/download')
  async downloadInvoice(@Param('id') id: number, @Res() res: Response) {
    const invoice = await this.invoicesService.findOne(id);

    if (!invoice || !invoice.pdfPath) {
      throw new NotFoundException('Fatura não encontrada');
    }

    const filePath = path.resolve(invoice.pdfPath);
    const fileName = `fatura-${invoice.monthReference}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Get('years')
  async findYears(): Promise<string[]> {
    const result = await this.invoicesService.getAvailableYears();
    return result.map((r) => r.monthReference);
  }

  @Get('months')
  async findMonths(
    @Query('year') year: string,
    @Query('client_id') clientId?: number,
  ): Promise<string[]> {
    const result = await this.invoicesService.getAvailableMonths(
      year,
      clientId,
    );
    return result.map((r) => r.monthReference);
  }
}
