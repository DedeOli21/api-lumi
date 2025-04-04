import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from './Domain/Entities/client.entity';
import { Invoice } from './Domain/Entities/invoice.entity';
import { DatabaseModule } from './Infra/Database/database.module';
import { ApplicationModule } from './Application/application.module';
import { PresentationModule } from './Presentation/presentation.module';
import { DataBaseConnectionService } from './Infra/Configurations/databaseConnectionService';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DataBaseConnectionService,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}
