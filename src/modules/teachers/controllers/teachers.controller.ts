import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
  Put,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

import { TeachersService } from '../services';
import { CreateTeacherDto, TeacherDto, UpdateTeacherDto } from '../dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  /**
   * Retrieves a paginated list of teachers.
   * @param {PageOptionsDto} pageOptionsDto - Pagination options.
   * @returns {Promise<{ data: TeacherDto[]; meta: PageMetaDto }>} Paginated teachers data and metadata.
   */
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: TeacherDto[]; meta: PageMetaDto }> {
    return await this.teachersService.findAll(pageOptionsDto);
  }

  /**
   * Retrieves a teacher by ID.
   * @param {string} id - The ID of the teacher.
   * @returns {Promise<TeacherDto>} The teacher data.
   * @throws {NotFoundException} If the teacher is not found.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeacherDto> {
    const teacher = await this.teachersService.findOne(+id);

    if (!teacher) {
      throw new NotFoundException('Teacher by id not found');
    }

    return teacher;
  }

  /**
   * Creates a new teacher.
   * @param {CreateTeacherDto} createTeacherDto - The data to create the teacher.
   * @returns {Promise<TeacherDto>} The created teacher data.
   * @throws {BadRequestException} If there are validation errors.
   */
  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherDto> {
    await this.teachersService.validateInsert(createTeacherDto);

    if (this.teachersService.Errors.length > 0) {
      throw new BadRequestException(this.teachersService.Errors.join(','));
    }

    return await this.teachersService.create(createTeacherDto);
  }

  /**
   * Updates an existing teacher.
   * @param {string} id - The ID of the teacher to update.
   * @param {UpdateTeacherDto} updateTeacherDto - The data to update the teacher.
   * @returns {Promise<TeacherDto>} The updated teacher data.
   * @throws {NotFoundException} If the teacher is not found.
   * @throws {BadRequestException} If there are validation errors.
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherDto> {
    const teacher = await this.teachersService.findOne(+id);

    if (!teacher) {
      throw new NotFoundException('Teacher by id not found');
    }

    await this.teachersService.validateUpdate(+id, updateTeacherDto);

    if (this.teachersService.Errors.length > 0) {
      throw new BadRequestException(this.teachersService.Errors.join(','));
    }

    return await this.teachersService.update(+id, updateTeacherDto);
  }

  /**
   * Deletes a teacher by ID.
   * @param {string} id - The ID of the teacher to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the teacher is not found.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const teacher = await this.teachersService.findOne(+id);

    if (!teacher) {
      throw new NotFoundException('Teacher by id not found');
    }

    await this.teachersService.remove(+id);

    return;
  }
}
