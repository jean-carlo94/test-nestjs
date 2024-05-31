import { AutoMap } from '@automapper/classes';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateStudentDto {
  //Validators
  @IsString()
  @IsNotEmpty()
  //Mappers
  @AutoMap()
  firsName: string;

  //Validators
  @IsString()
  @IsNotEmpty()
  //Mappers
  @AutoMap()
  lastName: string;

  //Validators
  @IsEmail()
  @IsNotEmpty()
  //Mappers
  @AutoMap()
  email: string;

  //Validators
  @IsBoolean()
  @IsOptional()
  //Mappers
  @AutoMap()
  isActive?: boolean;
}
