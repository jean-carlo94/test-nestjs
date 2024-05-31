import { AutoMap } from '@automapper/classes';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateClassDto {
  //Validators
  @IsNumber()
  @IsPositive()
  @IsOptional()
  //Mappers
  @AutoMap()
  id: number;

  //Validators
  @IsString()
  @IsNotEmpty()
  //Mappers
  @AutoMap()
  name: string;

  //Validators
  @IsString()
  @IsNotEmpty()
  //Mappers
  @AutoMap()
  description: string;

  //Validators
  @IsBoolean()
  @IsOptional()
  //Mappers
  @AutoMap()
  isActive?: boolean;
}
