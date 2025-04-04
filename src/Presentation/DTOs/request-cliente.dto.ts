import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export abstract class RequestClientDTO {
    @ApiProperty()
    @IsOptional()
    numberClient?: string;

    @ApiProperty()
    @IsOptional()
    clientName?: string;
    
}