import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Teacher } from '../entities';
import { TeacherDto, CreateTeacherDto, UpdateTeacherDto } from '../dto';

@Injectable()
export class TeacherProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  /**
   * Defines the mapping profile for the Teacher entity and its DTOs.
   * @returns {(mapper: Mapper) => void} The mapping configuration function.
   */
  override get profile() {
    return (mapper) => {
      //Entity To Dto
      createMap(mapper, Teacher, TeacherDto);

      //Dto To Entity
      createMap(mapper, TeacherDto, Teacher);

      //Create To Entity
      createMap(
        mapper,
        CreateTeacherDto,
        Teacher,
        forMember((dest) => dest.id, ignore()),
      );

      //Update To Entity
      createMap(mapper, UpdateTeacherDto, Teacher);
    };
  }
}
