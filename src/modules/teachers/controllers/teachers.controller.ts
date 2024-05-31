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

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: TeacherDto[]; meta: PageMetaDto }> {
    return await this.teachersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeacherDto> {
    const teacher = await this.teachersService.findOne(+id);

    if (!teacher) {
      throw new NotFoundException('Teacher by id not found');
    }

    return teacher;
  }

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
