import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Student } from '../entities';

import { BaseRepository } from 'src/common/repositories';
import { PageOptionsDto } from 'src/common/dto';

export class StudentRepository extends BaseRepository {
  private Model = 'students';

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly StudentDataSource: DataSource,
  ) {
    super(StudentDataSource);
  }

  /**
   * Finds all students with pagination.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<{ data: Student[]; meta: PageMetaDto }>} The paginated students data and metadata.
   */
  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  /**
   * Finds a single Student by ID.
   * @param {number} id - The ID of the Student.
   * @returns {Promise<Student>} The Student entity.
   */
  async findOne(id: number) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  /**
   * Creates a new Student entity.
   * @param {Student} data - The data to create the Student.
   * @returns {Student} The created Student entity.
   */
  create(data: Student) {
    const student = this.studentRepository.create(data);
    return student;
  }

  /**
   * Updates an existing Student entity.
   * @param {Student} data - The data to update the Student.
   * @returns {Promise<Student>} The updated Student entity.
   */
  async update(data: Student) {
    const student = await this.studentRepository.preload(data);
    const update: Student = await this.updateQueryExecute(student);

    return update;
  }

  /**
   * Removes a Student by ID.
   * @param {number} id - The ID of the Student to remove.
   * @returns {Promise<void>}
   */
  async remove(id: number) {
    await this.studentRepository.delete({ id });
  }

  /**
   * Saves a Student entity to the database.
   * @param {Student} Student - The Student entity to save.
   * @returns {Promise<void>}
   */
  async save(Student: Student) {
    await this.studentRepository.save(Student);
  }

  /**
   * Checks if a Student with the given email exists.
   * @param {string} email - The email to check.
   * @param {number} [id=null] - The ID to exclude from the check (for updates).
   * @returns {Promise<boolean>} Whether the Student exists.
   */
  async searchExist(email: string, id: number = null) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email) =:email`, { email });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  /**
   * Searches for all students with the given email.
   * @param {string} email - The email to search for.
   * @returns {Promise<boolean>} Whether any students with the email exist.
   */
  async searchAll(email: string) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email =:email)`, { email });

    return await queryBuilder.getExists();
  }
}
