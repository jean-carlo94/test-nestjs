import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Teacher } from '../entities';

import { BaseRepository } from 'src/common/class';
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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  async findOne(id: number) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  create(data: Teacher) {
    const teacher = this.teacherRepository.create(data);
    return teacher;
  }

  async update(data: Teacher) {
    const teacher = await this.teacherRepository.preload(data);
    const update: Teacher = await this.updateQueryExecute(teacher);

    return update;
  }

  async remove(id: number) {
    await this.teacherRepository.delete({ id });
  }

  async save(teacher: Teacher) {
    await this.teacherRepository.save(teacher);
  }

  async searchExist(email: string, id: number = null) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email) =:email`, { email });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  async searchAll(email: string) {
    const queryBuilder = this.teacherRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.email =:email)`, { email });

    return await queryBuilder.getExists();
  }

  async searchOne() {}
}
