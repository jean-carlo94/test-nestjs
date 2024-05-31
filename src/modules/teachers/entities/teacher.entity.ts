import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Class } from 'src/modules/classes/entities';

@Entity('teachers')
export class Teacher {
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

  @OneToMany(() => Class, (classEntity) => classEntity.teacher)
  classes: Class[];

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

  /**
   * Convert email to lowercase before inserting the teacher entity.
   * @returns {void}
   */
  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase();
  }

  /**
   * Convert email to lowercase before updating the teacher entity.
   * @returns {void}
   */
  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
