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

  /**
   * Defines the mapping profile for the Teacher entity and its DTOs.
   * @returns {(mapper: Mapper) => void} The mapping configuration function.
   */
  override get profile() {
    return (mapper) => {
      //Entity to DTO
      createMap(mapper, Student, StudentDto);

      //DTO to Entity
      createMap(mapper, StudentDto, Student);

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
