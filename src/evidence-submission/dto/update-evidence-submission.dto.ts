import { PartialType } from '@nestjs/swagger';
import { CreateEvidenceSubmissionDto } from './create-evidence-submission.dto';

export class UpdateEvidenceSubmissionDto extends PartialType(CreateEvidenceSubmissionDto) {}
