import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientNumber: string;

  @Column()
  name: string;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];
}
