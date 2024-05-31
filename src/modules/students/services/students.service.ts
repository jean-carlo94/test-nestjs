import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { CreateStudentDto, StudentDto, UpdateStudentDto } from '../dto';
import { StudentRepository } from '../repositories';
import { PageMetaDto, PageOptionsDto } from 'src/common/dto';
import { Student } from '../entities';

@Injectable()
export class StudentsService {
  public Errors: string[];

  constructor(
    private readonly repository: StudentRepository,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.Errors = [];
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: StudentDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classMapper.mapArray(data, Student, StudentDto);

    return { data: mapper, ...meta };
  }

  async findOne(id: number): Promise<StudentDto> {
    const student = await this.repository.findOne(id);
    return this.classMapper.map(student, Student, StudentDto);
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentDto> {
    const entity = this.classMapper.map(
      createStudentDto,
      CreateStudentDto,
      Student,
    );

    const student = this.repository.create(entity);
    await this.repository.save(student);

    return this.classMapper.map(student, Student, StudentDto);
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    updateStudentDto.id = id;
    const entity = this.classMapper.map(
      updateStudentDto,
      UpdateStudentDto,
      Student,
    );

    const student = await this.repository.update(entity);

    return this.classMapper.map(student, Student, StudentDto);
  }

  async remove(id: number) {
    await this.repository.remove(id);
  }

  async validateInsert(createStudentDto: CreateStudentDto): Promise<void> {
    const exist = await this.repository.searchExist(createStudentDto.email);

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }

  async validateUpdate(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(updateStudentDto.email, id);

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }
}
