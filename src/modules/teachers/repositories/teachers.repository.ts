import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Teacher } from '../entities';

import { BaseRepository } from 'src/common/repositories';
import { PageOptionsDto } from 'src/common/dto';

export class TeacherRepository extends BaseRepository {
  private Model = 'teachers';

  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly teacherDataSource: DataSource,
  ) {
    super(teacherDataSource);
  }

  /**
   * Finds all teachers with pagination.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<{ data: Teacher[]; meta: PageMetaDto }>} The paginated teachers data and metadata.
   */
  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  /**
   * Finds a single teacher by ID.
   * @param {number} id - The ID of the teacher.
   * @returns {Promise<Teacher>} The teacher entity.
   */
  async findOne(id: number) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  /**
   * Creates a new teacher entity.
   * @param {Teacher} data - The data to create the teacher.
   * @returns {Teacher} The created teacher entity.
   */
  create(data: Teacher) {
    const teacher = this.teacherRepository.create(data);
    return teacher;
  }

  /**
   * Updates an existing teacher entity.
   * @param {Teacher} data - The data to update the teacher.
   * @returns {Promise<Teacher>} The updated teacher entity.
   */
  async update(data: Teacher) {
    const teacher = await this.teacherRepository.preload(data);
    const update: Teacher = await this.updateQueryExecute(teacher);

    return update;
  }

  /**
   * Removes a teacher by ID.
   * @param {number} id - The ID of the teacher to remove.
   * @returns {Promise<void>}
   */
  async remove(id: number) {
    await this.teacherRepository.delete({ id });
  }

  /**
   * Saves a teacher entity to the database.
   * @param {Teacher} teacher - The teacher entity to save.
   * @returns {Promise<void>}
   */
  async save(teacher: Teacher) {
    await this.teacherRepository.save(teacher);
  }

  /**
   * Checks if a teacher with the given email exists.
   * @param {string} email - The email to check.
   * @param {number} [id=null] - The ID to exclude from the check (for updates).
   * @returns {Promise<boolean>} Whether the teacher exists.
   */
  async searchExist(email: string, id: number = null) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email) =:email`, { email });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  /**
   * Searches for all teachers with the given email.
   * @param {string} email - The email to search for.
   * @returns {Promise<boolean>} Whether any teachers with the email exist.
   */
  async searchAll(email: string) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email =:email)`, { email });

    return await queryBuilder.getExists();
  }
}
