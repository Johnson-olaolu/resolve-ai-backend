import { Test, TestingModule } from '@nestjs/testing';
import { EvidenceSubmissionController } from './evidence-submission.controller';
import { EvidenceSubmissionService } from './evidence-submission.service';

describe('EvidenceSubmissionController', () => {
  let controller: EvidenceSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvidenceSubmissionController],
      providers: [EvidenceSubmissionService],
    }).compile();

    controller = module.get<EvidenceSubmissionController>(EvidenceSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
