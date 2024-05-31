import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Student } from '../entities';

import { BaseRepository } from 'src/common/class';
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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  async findOne(id: number) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  create(data: Student) {
    const student = this.studentRepository.create(data);
    return student;
  }

  async update(data: Student) {
    const student = await this.studentRepository.preload(data);
    const update: Student = await this.updateQueryExecute(student);

    return update;
  }

  async remove(id: number) {
    await this.studentRepository.delete({ id });
  }

  async save(Student: Student) {
    await this.studentRepository.save(Student);
  }

  async searchExist(email: string, id: number = null) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email) =:email`, { email });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  async searchAll(email: string) {
    const queryBuilder = this.studentRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email =:email)`, { email });

    return await queryBuilder.getExists();
  }

  async searchOne() {}
}
