import { Module } from '@nestjs/common';
import { EvidenceSubmissionService } from './evidence-submission.service';
import { EvidenceSubmissionController } from './evidence-submission.controller';

@Module({
  controllers: [EvidenceSubmissionController],
  providers: [EvidenceSubmissionService],
})
export class EvidenceSubmissionModule {}
