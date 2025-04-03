import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  monthReference: string;

  @Column('float')
  energyConsumptionKwh: number;

  @Column('float')
  energyCompensatedKwh: number;

  @Column('float')
  totalValueWithoutGd: number;

  @Column('float')
  gdEconomyValue: number;

  @ManyToOne(() => Client, (client) => client.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  pdfPath?: string;
}
