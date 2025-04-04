import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export abstract class ResponseClientDTO {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsOptional()
    clientNumber: string;

    @ApiProperty()
    @IsOptional()
    name: string;
    
}