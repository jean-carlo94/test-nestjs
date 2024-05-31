import { AutoMap } from '@automapper/classes';
import { IsNumber, IsPositive } from 'class-validator';

import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends CreateStudentDto {
  //Validators
  @IsNumber()
  @IsPositive()
  //Mappers
  @AutoMap()
  id: number;
}
