import { AutoMap } from '@automapper/classes';
import { IsNumber, IsPositive } from 'class-validator';

import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends CreateTeacherDto {
  //Validators
  @IsNumber()
  @IsPositive()
  //Mappers
  @AutoMap()
  id: number;
}
