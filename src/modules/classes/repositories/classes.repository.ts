import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories';
import { PageOptionsDto } from 'src/common/dto';
import { Class } from '../entities';

export class ClassesRepository extends BaseRepository {
  private Model = 'classes';

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly classDataSource: DataSource,
  ) {
    super(classDataSource);
  }

  /**
   * Retrieves all classes with pagination.
   * @param {PageOptionsDto} pageOptionsDto - Pagination options.
   * @returns {Promise<{ data: Class[]; meta: PageMetaDto }>} Paginated class data and metadata.
   */
  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  /**
   * Retrieves a class by its ID.
   * @param {number} id - Class ID.
   * @returns {Promise<Class>} The class data.
   */
  async findOne(id: number) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  /**
   * Creates a new class entity.
   * @param {Class} data - Class data.
   * @returns {Class} The created class entity.
   */
  create(data: Class) {
    const classEntity = this.classRepository.create(data);
    return classEntity;
  }

  /**
   * Updates an existing class entity.
   * @param {Class} data - Class data.
   * @returns {Promise<Class>} The updated class entity.
   */
  async update(data: Class) {
    const classEntity = await this.classRepository.preload(data);
    const update: Class = await this.updateQueryExecute(classEntity);

    return update;
  }

  /**
   * Removes a class by its ID.
   * @param {number} id - Class ID.
   * @returns {Promise<void>}
   */
  async remove(id: number) {
    await this.classRepository.delete({ id });
  }

  /**
   * Saves a class entity.
   * @param {Class} classEntity - Class entity.
   * @returns {Promise<void>}
   */
  async save(classEntity: Class) {
    await this.classRepository.save(classEntity);
  }

  /**
   * Retrieves the teacher of a class.
   * @param {Class} classEntity - Class entity.
   * @returns {Promise<Class>} The class entity with the teacher.
   */
  async getTeacher(classEntity: Class) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .leftJoinAndSelect(`${this.Model}.teacher`, 'teacher')
      .where(`${this.Model}.id =:id`, { id: classEntity.id });

    return await queryBuilder.getOne();
  }

  /**
   * Retrieves the students of a class.
   * @param {Class} classEntity - Class entity.
   * @returns {Promise<Class>} The class entity with the students.
   */
  async getStudents(classEntity: Class) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .leftJoinAndSelect(`${this.Model}.students`, 'students')
      .where(`${this.Model}.id =:id`, { id: classEntity.id });

    return await queryBuilder.getOne();
  }

  /**
   * Checks if a class with the same name already exists.
   * @param {string} name - Class name.
   * @param {number} [id=null] - Optional class ID to exclude from the search.
   * @returns {Promise<boolean>} True if a class with the same name exists, otherwise false.
   */
  async searchExist(name: string, id: number = null) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.name) =:name`, { name });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  /**
   * Searches for classes with the given name.
   * @param {string} name - Class name.
   * @returns {Promise<boolean>} True if any classes with the given name exist, otherwise false.
   */
  async searchAll(name: string) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.name =:name)`, { name });

    return await queryBuilder.getExists();
  }
}
