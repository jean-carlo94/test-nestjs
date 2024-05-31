import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { PageMetaDto, PageOptionsDto } from 'src/common/dto';

import { Class } from '../entities';
import { ClassesRepository } from '../repositories';
import { ClassDto, CreateClassDto, UpdateClassDto } from '../dto';

import { Teacher } from 'src/modules/teachers/entities';
import { TeacherDto } from 'src/modules/teachers/dto';
import { Student } from 'src/modules/students/entities';
import { StudentDto } from 'src/modules/students/dto';

@Injectable()
export class ClassesService {
  public Errors: string[];

  constructor(
    private readonly repository: ClassesRepository,
    @InjectMapper() private readonly classesMapper: Mapper,
  ) {
    this.Errors = [];
  }

  /**
   * Retrieves all classes with pagination.
   * @param {PageOptionsDto} pageOptionsDto - Pagination options.
   * @returns {Promise<{ data: ClassDto[]; meta: PageMetaDto }>} Paginated class data and metadata.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ data: ClassDto[]; meta: PageMetaDto }> {
    const { data, ...meta } = await this.repository.findAll(pageOptionsDto);
    const mapper = this.classesMapper.mapArray(data, Class, ClassDto);

    return { data: mapper, ...meta };
  }

  /**
   * Retrieves a class by its ID.
   * @param {number} id - Class ID.
   * @returns {Promise<ClassDto>} The class data.
   */
  async findOne(id: number): Promise<ClassDto> {
    const classEntity = await this.repository.findOne(id);
    return this.classesMapper.map(classEntity, Class, ClassDto);
  }

  /**
   * Creates a new class.
   * @param {CreateClassDto} createClassDto - Data for creating a new class.
   * @returns {Promise<ClassDto>} The created class data.
   */
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

  /**
   * Updates an existing class.
   * @param {number} id - Class ID.
   * @param {UpdateClassDto} updateClassDto - Data for updating the class.
   * @returns {Promise<ClassDto>} The updated class data.
   */
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

  /**
   * Deletes a class by its ID.
   * @param {number} id - Class ID.
   * @returns {Promise<void>}
   */
  async remove(id: number) {
    await this.repository.remove(id);
  }

  /**
   * Adds a teacher to a class.
   * @param {ClassDto} classDto - The class data.
   * @param {TeacherDto} teacherDto - The teacher data.
   * @returns {Promise<ClassDto>} The updated class data.
   */
  async addTeacher(classDto: ClassDto, teacherDto: TeacherDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const teacher = this.classesMapper.map(teacherDto, TeacherDto, Teacher);

    classEntity.teacher = teacher;

    const classTeacher = await this.repository.update(classEntity);

    return this.classesMapper.map(classTeacher, Class, ClassDto);
  }

  /**
   * Retrieves the teacher of a class.
   * @param {ClassDto} classDto - The class data.
   * @returns {Promise<TeacherDto>} The teacher data.
   */
  async findTeacher(classDto: ClassDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const getTeacherClass = await this.repository.getTeacher(classEntity);

    return this.classesMapper.map(getTeacherClass.teacher, Teacher, TeacherDto);
  }

  /**
   * Adds a student to a class.
   * @param {ClassDto} classDto - The class data.
   * @param {StudentDto} studentDto - The student data.
   * @returns {Promise<ClassDto>} The updated class data.
   */
  async addStudent(classDto: ClassDto, studentDto: StudentDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const student = this.classesMapper.map(studentDto, StudentDto, Student);

    const getStudentsClass = await this.repository.getStudents(classEntity);

    classEntity.students = [...getStudentsClass.students, student];

    const classStudent = await this.repository.update(classEntity);

    return this.classesMapper.map(classStudent, Class, ClassDto);
  }

  /**
   * Retrieves the students of a class.
   * @param {ClassDto} classDto - The class data.
   * @returns {Promise<StudentDto[]>} The students data.
   */
  async findStudents(classDto: ClassDto) {
    const classEntity = this.classesMapper.map(classDto, ClassDto, Class);
    const getStudentsClass = await this.repository.getStudents(classEntity);

    return this.classesMapper.mapArray(
      getStudentsClass.students,
      Student,
      StudentDto,
    );
  }

  /**
   * Validates if a class with the same name already exists before insertion.
   * @param {CreateClassDto} createClassDto - Data for creating a new class.
   * @returns {Promise<void>}
   */
  async validateInsert(createClassDto: CreateClassDto): Promise<void> {
    const exist = await this.repository.searchExist(
      createClassDto.name.toLowerCase(),
    );

    if (exist) {
      this.Errors.push('This name has already been used');
    }
  }

  /**
   * Validates if a class with the same name already exists before updating.
   * @param {number} id - Class ID.
   * @param {UpdateClassDto} updateClassDto - Data for updating the class.
   * @returns {Promise<void>}
   */
  async validateUpdate(
    id: number,
    updateClassDto: UpdateClassDto,
  ): Promise<void> {
    const exist = await this.repository.searchExist(
      updateClassDto.name.toLowerCase(),
      id,
    );

    if (exist) {
      this.Errors.push('This name has already been used');
    }
  }
}
