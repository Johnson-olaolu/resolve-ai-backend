import { Test, TestingModule } from '@nestjs/testing';
import { EvidenceSubmissionService } from './evidence-submission.service';

describe('EvidenceSubmissionService', () => {
  let service: EvidenceSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvidenceSubmissionService],
    }).compile();

    service = module.get<EvidenceSubmissionService>(EvidenceSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
