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

  /**
   * Finds all teachers with pagination.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<{ data: TeacherDto[]; meta: PageMetaDto }>} The paginated teachers data and metadata.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: TeacherDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classMapper.mapArray(data, Teacher, TeacherDto);

    return { data: mapper, ...meta };
  }

  /**
   * Finds a single teacher by ID.
   * @param {number} id - The ID of the teacher.
   * @returns {Promise<TeacherDto>} The teacher data.
   */
  async findOne(id: number): Promise<TeacherDto> {
    const teacher = await this.repository.findOne(id);
    return this.classMapper.map(teacher, Teacher, TeacherDto);
  }

  /**
   * Creates a new teacher.
   * @param {CreateTeacherDto} createTeacherDto - The data to create the teacher.
   * @returns {Promise<TeacherDto>} The created teacher data.
   */
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

  /**
   * Updates an existing teacher.
   * @param {number} id - The ID of the teacher to update.
   * @param {UpdateTeacherDto} updateTeacherDto - The data to update the teacher.
   * @returns {Promise<TeacherDto>} The updated teacher data.
   */
  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherDto> {
    updateTeacherDto.id = id;
    const entity = this.classMapper.map(
      updateTeacherDto,
      UpdateTeacherDto,
      Teacher,
    );

    const teacher = await this.repository.update(entity);

    return this.classMapper.map(teacher, Teacher, TeacherDto);
  }

  /**
   * Removes a teacher by ID.
   * @param {number} id - The ID of the teacher to remove.
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    await this.repository.remove(id);
  }

  /**
   * Validates the data for creating a new teacher.
   * @param {CreateTeacherDto} createTeacherDto - The data to validate.
   * @returns {Promise<void>}
   */
  async validateInsert(createTeacherDto: CreateTeacherDto): Promise<void> {
    const exist = await this.repository.searchExist(
      createTeacherDto.email.toLowerCase(),
    );

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }

  /**
   * Validates the data for updating an existing teacher.
   * @param {number} id - The ID of the teacher to update.
   * @param {UpdateTeacherDto} updateTeacherDto - The data to validate.
   * @returns {Promise<void>}
   */
  async validateUpdate(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(
      updateTeacherDto.email.toLowerCase(),
      id,
    );

    if (exist) {
      this.Errors.push('This email has already been used');
    }
  }
}
