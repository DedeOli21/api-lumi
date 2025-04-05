import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Client } from 'src/Domain/Entities/client.entity';

export abstract class ResponseClientDTO extends Client { }
