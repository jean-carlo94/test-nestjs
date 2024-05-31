import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';

import { Class } from '../entities';
import { ClassDto, CreateClassDto, UpdateClassDto } from '../dto';

@Injectable()
export class ClassesProfile extends AutomapperProfile {
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
      createMap(mapper, Class, ClassDto);

      //Dto To Entity
      createMap(mapper, ClassDto, Class);

      //Create
      createMap(
        mapper,
        CreateClassDto,
        Class,
        forMember((dest) => dest.id, ignore()),
      );

      //Update
      createMap(mapper, UpdateClassDto, Class);
    };
  }
}
