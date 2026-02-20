import { Injectable } from '@nestjs/common';
import { CreateEvidenceSubmissionDto } from './dto/create-evidence-submission.dto';
import { UpdateEvidenceSubmissionDto } from './dto/update-evidence-submission.dto';

@Injectable()
export class EvidenceSubmissionService {
  create(createEvidenceSubmissionDto: CreateEvidenceSubmissionDto) {
    return 'This action adds a new evidenceSubmission';
  }

  findAll() {
    return `This action returns all evidenceSubmission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evidenceSubmission`;
  }

  update(id: number, updateEvidenceSubmissionDto: UpdateEvidenceSubmissionDto) {
    return `This action updates a #${id} evidenceSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} evidenceSubmission`;
  }
}
