import { AutoMap } from '@automapper/classes';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeacherDto {
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
