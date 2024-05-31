import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

import { Class } from '../entities';
import { ClassesRepository } from '../repositories';
import { ClassDto, CreateClassDto, UpdateClassDto } from '../dto';

import { Teacher } from 'src/modules/teachers/entities';
import { TeacherDto } from 'src/modules/teachers/dto';

@Injectable()
export class ClassesService {
  public Errors: string[];

  constructor(
    private readonly repository: ClassesRepository,
    @InjectMapper() private readonly classesMapper: Mapper,
  ) {
    this.Errors = [];
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: ClassDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classesMapper.mapArray(data, Class, ClassDto);

    return { data: mapper, ...meta };
  }

  async findOne(id: number): Promise<ClassDto> {
    const classEntity = await this.repository.findOne(id);
    return this.classesMapper.map(classEntity, Class, ClassDto);
  }

  async create(createClassDto: CreateClassDto): Promise<ClassDto> {
    const entity = this.classesMapper.map(
      createClassDto,
      CreateClassDto,
      Class,
    );

    const classEntity = this.repository.create(entity);
    await this.repository.save(classEntity);

    return this.classesMapper.map(classEntity, Class, ClassDto);
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    updateClassDto.id = id;
    const entity = this.classesMapper.map(
      updateClassDto,
      UpdateClassDto,
      Class,
    );

    const classEntity = await this.repository.update(entity);

    return this.classesMapper.map(classEntity, Class, ClassDto);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  async addTeacher(classDto: ClassDto, teacherDto: TeacherDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const teacher = this.classesMapper.map(teacherDto, TeacherDto, Teacher);

    classEntity.teacher = teacher;

    const classTeacher = await this.repository.update(classEntity);

    return this.classesMapper.map(classTeacher, Class, ClassDto);
  }

  async findTeacher(classDto: ClassDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const getTeacherClass = await this.repository.getTeacher(classEntity);

    return this.classesMapper.map(getTeacherClass.teacher, Teacher, TeacherDto);
  }

  async validateInsert(createClassDto: CreateClassDto): Promise<void> {
    const exist = await this.repository.searchExist(createClassDto.name);

    if (exist) {
      this.Errors.push('This name has already been used');
    }
  }

  async validateUpdate(
    id: number,
    updateClassDto: UpdateClassDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(updateClassDto.name, id);

    if (exist) {
      this.Errors.push('This name has already been used');
    }
  }
}
