import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "src/Domain/Entities/client.entity";
import { Invoice } from "src/Domain/Entities/invoice.entity";
import { IClientRepository } from "src/Domain/Interfaces/client.repositories";
import { ClientImpl } from "./client.impl";
import { IInvoiceRepository } from "src/Domain/Interfaces/invoice.repositories";
import { InvoiceImpl } from "./invoice.impl";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Client,Invoice])
    ],
    exports: [
        IClientRepository,
        IInvoiceRepository,
    ],
    providers: [
        { provide: IClientRepository, useClass: ClientImpl },
        { provide: IInvoiceRepository, useClass: InvoiceImpl}
    ],
})
export class DatabaseModule {}