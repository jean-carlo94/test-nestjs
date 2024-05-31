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

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly teachersService: TeachersService,
  ) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: ClassDto[]; meta: PageMetaDto }> {
    return await this.classesService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClassDto> {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    return classEntity;
  }

  @Post()
  async create(@Body() createClassDto: CreateClassDto): Promise<ClassDto> {
    await this.classesService.validateInsert(createClassDto);

    if (this.classesService.Errors.length > 0) {
      throw new BadRequestException(this.classesService.Errors.join(','));
    }

    return await this.classesService.create(createClassDto);
  }

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

  @Get(':id/assign-teacher')
  async findTeacher(@Param('id') id: string) {
    const classEntity = await this.classesService.findOne(+id);

    if (!classEntity) {
      throw new NotFoundException('Class by id not found');
    }

    return await this.classesService.findTeacher(classEntity);
  }

  @Post(':id/assign-students')
  async assignStudent() {
    return 'ok';
  }

  @Get(':id/assign-students')
  async findStudent() {
    return 'ok';
  }
}
