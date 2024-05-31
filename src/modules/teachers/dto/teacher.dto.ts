import { AutoMap } from '@automapper/classes';

export class TeacherDto {
  @AutoMap()
  id: number;

  @AutoMap()
  firsName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  isActive?: boolean;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}
