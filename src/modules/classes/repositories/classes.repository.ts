import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/class';
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

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .select();

    return await this.queryBuilderPaginationExecute(
      queryBuilder,
      pageOptionsDto,
    );
  }

  async findOne(id: number) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`${this.Model}.id =:id`, { id });

    return await queryBuilder.getOne();
  }

  create(data: Class) {
    const classEntity = this.classRepository.create(data);
    return classEntity;
  }

  async update(data: Class) {
    const classEntity = await this.classRepository.preload(data);
    const update: Class = await this.updateQueryExecute(classEntity);

    return update;
  }

  async remove(id: number) {
    await this.classRepository.delete({ id });
  }

  async save(classEntity: Class) {
    await this.classRepository.save(classEntity);
  }

  async getTeacher(classEntity: Class) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .leftJoinAndSelect(`${this.Model}.teacher`, 'teacher')
      .where(`${this.Model}.id =:id`, { id: classEntity.id });

    return await queryBuilder.getOne();
  }

  async searchExist(name: string, id: number = null) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.name) =:name`, { name });

    if (id) {
      queryBuilder.andWhere(`${this.Model}.id != :id`, { id });
    }

    return await queryBuilder.getExists();
  }

  async searchAll(name: string) {
    const queryBuilder = this.classRepository
      .createQueryBuilder(this.Model)
      .where(`LOWER(${this.Model}.name =:name)`, { name });

    return await queryBuilder.getExists();
  }

  async searchOne() {}
}
