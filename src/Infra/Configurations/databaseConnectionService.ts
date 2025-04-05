import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Client } from 'src/Domain/Entities/client.entity';
import { Invoice } from 'src/Domain/Entities/invoice.entity';

@Injectable()
export class DataBaseConnectionService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: Number(this.configService.get<number>('DATABASE_PORT')),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [Client, Invoice],
      synchronize: this.configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
    };
  }
}
