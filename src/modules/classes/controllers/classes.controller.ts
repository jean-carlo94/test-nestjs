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

import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

import { ClassesService } from '../services';
import { ClassDto, CreateClassDto, UpdateClassDto } from '../dto';

import { TeachersService } from 'src/modules/teachers/services';
import { UpdateTeacherDto } from 'src/modules/teachers/dto';
import { UpdateStudentDto } from 'src/modules/students/dto';
import { StudentsService } from 'src/modules/students/services';

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
  ) {}

  /**
   * Retrieves all classes with pagination.
   * @param {PageOptionsDto} pageOptionsDto - Pagination options.
   * @returns {Promise<{ data: ClassDto[]; meta: PageMetaDto }>} Paginated class data and metadata.
   */
  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: ClassDto[]; meta: PageMetaDto }> {
    return await this.classesService.findAll(pageOptionsDto);
  }

  /**
   * Retrieves a class by its ID.
   * @param {string} id - Class ID.
   * @returns {Promise<ClassDto>} The class data.
   * @throws {NotFoundException} If class is not found.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClassDto> {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    return classEntity;
  }

  /**
   * Creates a new class.
   * @param {CreateClassDto} createClassDto - Class data.
   * @returns {Promise<ClassDto>} The created class data.
   * @throws {BadRequestException} If validation fails.
   */
  @Post()
  async create(@Body() createClassDto: CreateClassDto): Promise<ClassDto> {
    await this.classesService.validateInsert(createClassDto);

    if (this.classesService.Errors.length > 0) {
      throw new BadRequestException(this.classesService.Errors.join(','));
    }

    return await this.classesService.create(createClassDto);
  }

  /**
   * Updates an existing class by its ID.
   * @param {string} id - Class ID.
   * @param {UpdateClassDto} updateClassDto - Updated class data.
   * @returns {Promise<ClassDto>} The updated class data.
   * @throws {NotFoundException} If class is not found.
   * @throws {BadRequestException} If validation fails.
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<ClassDto> {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    await this.classesService.validateUpdate(+id, updateClassDto);

    if (this.classesService.Errors.length > 0) {
      throw new BadRequestException(this.classesService.Errors.join(','));
    }

    return await this.classesService.update(+id, updateClassDto);
  }

  /**
   * Deletes a class by its ID.
   * @param {string} id - Class ID.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If class is not found.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    await this.classesService.remove(+id);

    return;
  }

  /**
   * Assigns a teacher to a class by its ID.
   * @param {string} id - Class ID.
   * @param {UpdateTeacherDto} updateTeacherDto - Teacher data.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If class or teacher is not found.
   */
  @Post(':id/assign-teacher')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    const teacher = await this.teachersService.findOne(updateTeacherDto.id);

    if (!teacher) {
      throw new NotFoundException('Teacher by id not found');
    }

    await this.classesService.addTeacher(classEntity, teacher);
    return;
  }

  /**
   * Retrieves the teacher of a class by its ID.
   * @param {string} id - Class ID.
   * @returns {Promise<TeacherDto>} The teacher data.
   * @throws {NotFoundException} If class is not found.
   */
  @Get(':id/assign-teacher')
  async findTeacher(@Param('id') id: string) {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    return await this.classesService.findTeacher(classEntity);
  }

  /**
   * Assigns a student to a class by its ID.
   * @param {string} id - Class ID.
   * @param {UpdateStudentDto} updateStudentDto - Student data.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If class or student is not found.
   */
  @Post(':id/assign-students')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    const student = await this.studentsService.findOne(updateStudentDto.id);

    if (!student) {
      throw new NotFoundException('Student by id not found');
    }

    await this.classesService.addStudent(classEntity, student);
    return;
  }

  /**
   * Retrieves the students of a class by its ID.
   * @param {string} id - Class ID.
   * @returns {Promise<StudentDto[]>} The students data.
   * @throws {NotFoundException} If class is not found.
   */
  @Get(':id/assign-students')
  async findStudent(@Param('id') id: string) {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    return await this.classesService.findStudents(classEntity);
  }
}
