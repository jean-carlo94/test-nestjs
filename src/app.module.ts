import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

//Configs
import { ConfigDataSource } from './config/database';

//Modules
import { TeachersModule } from './modules/teachers/teachers.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassesModule } from './modules/classes/classes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(ConfigDataSource),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TeachersModule,
    StudentsModule,
    ClassesModule,
  ],
})
export class AppModule {}
