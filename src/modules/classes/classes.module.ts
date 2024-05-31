import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Class } from './entities';

import { ClassesController } from './controllers';
import { ClassesService } from './services';
import { ClassesRepository } from './repositories';
import { ClassesProfile } from './automappers';

import { TeachersModule } from '../teachers/teachers.module';
import { StudentsModule } from '../students/students.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, ClassesRepository, ClassesProfile],
  imports: [TypeOrmModule.forFeature([Class]), TeachersModule, StudentsModule],
})
export class ClassesModule {}
