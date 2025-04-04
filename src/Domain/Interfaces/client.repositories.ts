import { RequestClientDTO } from "src/Presentation/DTOs/request-cliente.dto";
import { Client } from "../Entities/client.entity";

export abstract class IClientRepository {
    findAll: (filters: RequestClientDTO) =>  Promise<Client[]>;
    findByClientNumber: (clientNumber: string) => Promise<Client | null>;
    create: (clientNumber: string, name: string) => Promise<Client>;
}