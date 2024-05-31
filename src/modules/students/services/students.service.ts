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

  /**
   * Finds all students with pagination.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<{ data: StudentDto[]; meta: PageMetaDto }>} The paginated students data and metadata.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: StudentDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classMapper.mapArray(data, Student, StudentDto);

    return { data: mapper, ...meta };
  }

  /**
   * Finds a single student by ID.
   * @param {number} id - The ID of the student.
   * @returns {Promise<StudentDto>} The student data.
   */
  async findOne(id: number): Promise<StudentDto> {
    const student = await this.repository.findOne(id);
    return this.classMapper.map(student, Student, StudentDto);
  }

  /**
   * Creates a new student.
   * @param {CreateStudentDto} createStudentDto - The data to create the student.
   * @returns {Promise<StudentDto>} The created student data.
   */
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

  /**
   * Updates an existing student.
   * @param {number} id - The ID of the student to update.
   * @param {UpdateStudentDto} updateStudentDto - The data to update the student.
   * @returns {Promise<studentDto>} The updated student data.
   */
  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    updateStudentDto.id = id;
    const entity = this.classMapper.map(
      updateStudentDto,
      UpdateStudentDto,
      Student,
    );

    const student = await this.repository.update(entity);

    return this.classMapper.map(student, Student, StudentDto);
  }

  /**
   * Removes a student by ID.
   * @param {number} id - The ID of the student to remove.
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    await this.repository.remove(id);
  }

  /**
   * Validates the data for creating a new student.
   * @param {CreateStudentDto} createStudentDto - The data to validate.
   * @returns {Promise<void>}
   */
  async validateInsert(createStudentDto: CreateStudentDto): Promise<void> {
    const exist = await this.repository.searchExist(
      createStudentDto.email.toLowerCase(),
    );

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }

  /**
   * Validates the data for updating an existing student.
   * @param {number} id - The ID of the student to update.
   * @param {UpdateStudentDto} updateStudentDto - The data to validate.
   * @returns {Promise<void>}
   */
  async validateUpdate(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(
      updateStudentDto.email.toLowerCase(),
      id,
    );

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }
}
