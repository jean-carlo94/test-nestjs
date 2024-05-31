import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { StudentsService } from '../services';
import { CreateStudentDto, StudentDto, UpdateStudentDto } from '../dto';
import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Retrieves a paginated list of students.
   * @param {PageOptionsDto} pageOptionsDto - Pagination options.
   * @returns {Promise<{ data: StudentDto[]; meta: PageMetaDto }>} Paginated students data and metadata.
   */
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: StudentDto[]; meta: PageMetaDto }> {
    return await this.studentsService.findAll(pageOptionsDto);
  }

  /**
   * Retrieves a student by ID.
   * @param {string} id - The ID of the student.
   * @returns {Promise<StudentDto>} The student data.
   * @throws {NotFoundException} If the student is not found.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentDto> {
    const student = await this.studentsService.findOne(+id);

    if (!student) {
      throw new NotFoundException('Student by id not found');
    }

    return student;
  }

  /**
   * Creates a new student.
   * @param {CreateStudentDto} createStudentDto - The data to create the student.
   * @returns {Promise<StudentDto>} The created student data.
   * @throws {BadRequestException} If there are validation errors.
   */
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentDto> {
    await this.studentsService.validateInsert(createStudentDto);

    if (this.studentsService.Errors.length > 0) {
      throw new BadRequestException(this.studentsService.Errors.join(','));
    }

    return await this.studentsService.create(createStudentDto);
  }

  /**
   * Updates an existing student.
   * @param {string} id - The ID of the student to update.
   * @param {UpdateStudentDto} updateStudentDto - The data to update the student.
   * @returns {Promise<StudentDto>} The updated student data.
   * @throws {NotFoundException} If the student is not found.
   * @throws {BadRequestException} If there are validation errors.
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    const student = await this.studentsService.findOne(+id);

    if (!student) {
      throw new NotFoundException('Student by id not found');
    }

    await this.studentsService.validateUpdate(+id, updateStudentDto);

    if (this.studentsService.Errors.length > 0) {
      throw new BadRequestException(this.studentsService.Errors.join(','));
    }

    return await this.studentsService.update(+id, updateStudentDto);
  }

  /**
   * Deletes a student by ID.
   * @param {string} id - The ID of the student to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If the student is not found.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const student = await this.studentsService.findOne(+id);

    if (!student) {
      throw new NotFoundException('Student by id not found');
    }

    await this.studentsService.remove(+id);

    return;
  }
}
