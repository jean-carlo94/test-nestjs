import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Teacher } from './entities';

import { TeachersController } from './controllers';
import { TeachersService } from './services';
import { TeacherRepository } from './repositories';
import { TeacherProfile } from './automappers';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService, TeacherRepository, TeacherProfile],
  imports: [TypeOrmModule.forFeature([Teacher])],
  exports: [TeachersService],
})
export class TeachersModule {}
