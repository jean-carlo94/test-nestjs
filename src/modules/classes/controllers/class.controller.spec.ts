import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';
import { ClassesService } from '../services';
import { ClassesController } from '.';

describe('ClassController', () => {
  let controller: ClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [ClassesService],
    }).compile();

    controller = module.get<ClassController>(ClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
