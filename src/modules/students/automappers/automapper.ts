import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';

import { Student } from '../entities';
import { CreateStudentDto, StudentDto, UpdateStudentDto } from '../dto';

@Injectable()
export class StudentProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      //Entity
      createMap(mapper, Student, StudentDto);

      //Create
      createMap(
        mapper,
        CreateStudentDto,
        Student,
        forMember((dest) => dest.id, ignore()),
      );

      //Update
      createMap(mapper, UpdateStudentDto, Student);
    };
  }
}
