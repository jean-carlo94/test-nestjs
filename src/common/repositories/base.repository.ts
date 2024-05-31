import { Logger } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';

import { PageDto, PageMetaDto, PageOptionsDto } from '../dto';

export abstract class BaseRepository {
  readonly logger = new Logger('BaseRepository');

  /**
   * Constructor for the BaseService.
   * @param dataSource - The data source for the BaseService.
   */
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Execute a paginated query using the provided `SelectQueryBuilder`.
   * @param queryBuilder - The SelectQueryBuilder for the query.
   * @param model - The model name for the query.
   * @param pageOptionsDto - The options for pagination.
   * @returns A PageDto containing entities and metadata.
   */
  async queryBuilderPaginationExecute(
    queryBuilder: SelectQueryBuilder<any>,
    pageOptionsDto: PageOptionsDto,
  ) {
    const { take = 10, skip = 0 } = pageOptionsDto;

    queryBuilder.skip(skip).take(take);

    try {
      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  /**
   * Execute a query for updating an entity.
   * @param entity - The entity to be updated.
   * @returns The updated entity.
   */
  async updateQueryExecute(entity: any) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return entity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    }
  }

  /**
   * Handle database exceptions and throw appropriate NestJS exceptions.
   * @param error - The database error to handle.
   */
  handleDbExceptions(error: any): void {
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('users')) {
        if (error.sqlMessage.includes('@')) {
          this.logger.error('Error: This Email has already been used');
        } else {
          this.logger.error('Error: This Username has already been used');
        }
      }

      this.logger.error(error.sqlMessage);
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2')
      this.logger.error(error.sqlMessage);

    this.logger.error(error);

    this.logger.error('Unexpected error, check server logs');
  }
}
