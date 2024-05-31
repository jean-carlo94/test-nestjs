import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student } from './entities';

import { StudentsController } from './controllers';
import { StudentsService } from './services';
import { StudentRepository } from './repositories';
import { StudentProfile } from './automappers';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository, StudentProfile],
  imports: [TypeOrmModule.forFeature([Student])],
  exports: [StudentsService],
})
export class StudentsModule {}
