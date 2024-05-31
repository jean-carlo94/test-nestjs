import { AutoMap } from '@automapper/classes';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('students')
export class Student {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column('varchar', { length: 100, nullable: false })
  firsName: string;

  @AutoMap()
  @Column('varchar', { length: 100, nullable: false })
  lastName: string;

  @AutoMap()
  @Column('varchar', { length: 100, unique: true })
  email: string;

  @AutoMap()
  @Column('boolean', { default: true })
  isActive: boolean;

  @AutoMap()
  @VersionColumn()
  version: number;

  @AutoMap()
  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt!: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt!: Date;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
