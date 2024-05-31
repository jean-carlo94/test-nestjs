import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

import { Teacher } from '../entities';
import { TeacherRepository } from '../repositories';
import { CreateTeacherDto, TeacherDto, UpdateTeacherDto } from '../dto';

@Injectable()
export class TeachersService {
  public Errors: string[];

  constructor(
    private readonly repository: TeacherRepository,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.Errors = [];
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: TeacherDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classMapper.mapArray(data, Teacher, TeacherDto);

    return { data: mapper, ...meta };
  }

  async findOne(id: number): Promise<TeacherDto> {
    const teacher = await this.repository.findOne(id);
    return this.classMapper.map(teacher, Teacher, TeacherDto);
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherDto> {
    const entity = this.classMapper.map(
      createTeacherDto,
      CreateTeacherDto,
      Teacher,
    );

    const teacher = this.repository.create(entity);
    await this.repository.save(teacher);

    return this.classMapper.map(teacher, Teacher, TeacherDto);
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    updateTeacherDto.id = id;
    const entity = this.classMapper.map(
      updateTeacherDto,
      UpdateTeacherDto,
      Teacher,
    );

    const teacher = await this.repository.update(entity);

    return this.classMapper.map(teacher, Teacher, TeacherDto);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  async validateInsert(createTeacherDto: CreateTeacherDto): Promise<void> {
    const exist = await this.repository.searchExist(createTeacherDto.email);

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }

  async validateUpdate(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(updateTeacherDto.email, id);

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }
}
