import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from './entities/client.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoicesModule } from './invoices/invoices.module';
import { ClientsModule } from './clients/clients.module';
import { DashBoardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT'), 10),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [Client, Invoice],
        synchronize: true, // só em desenvolvimento!
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Client, Invoice]),
    InvoicesModule,
    ClientsModule,
    DashBoardModule
  ],
})
export class AppModule {}
