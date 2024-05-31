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

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: StudentDto[]; meta: PageMetaDto }> {
    return await this.studentsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentDto> {
    const student = await this.studentsService.findOne(+id);

    if (!student) {
      throw new NotFoundException('Student by id not found');
    }

    return student;
  }

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
