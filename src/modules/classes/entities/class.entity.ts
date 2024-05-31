import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { Teacher } from 'src/modules/teachers/entities';
import { Student } from 'src/modules/students/entities';

@Entity('classes')
export class Class {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @AutoMap()
  @Column('text', { nullable: false })
  description: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  teacher: Teacher;

  @ManyToMany(() => Student)
  @JoinTable()
  students: Student[];

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
    this.name = this.name.toUpperCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
