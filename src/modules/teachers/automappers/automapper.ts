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

  override get profile() {
    return (mapper) => {
      //Entity To Dto
      createMap(mapper, Teacher, TeacherDto);

      //Dto To Entity
      createMap(mapper, TeacherDto, Teacher);

      //Create
      createMap(
        mapper,
        CreateTeacherDto,
        Teacher,
        forMember((dest) => dest.id, ignore()),
      );

      //Update
      createMap(mapper, UpdateTeacherDto, Teacher);
    };
  }
}
