import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvidenceSubmissionService } from './evidence-submission.service';
import { CreateEvidenceSubmissionDto } from './dto/create-evidence-submission.dto';
import { UpdateEvidenceSubmissionDto } from './dto/update-evidence-submission.dto';

@Controller('evidence-submission')
export class EvidenceSubmissionController {
  constructor(private readonly evidenceSubmissionService: EvidenceSubmissionService) {}

  @Post()
  create(@Body() createEvidenceSubmissionDto: CreateEvidenceSubmissionDto) {
    return this.evidenceSubmissionService.create(createEvidenceSubmissionDto);
  }

  @Get()
  findAll() {
    return this.evidenceSubmissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceSubmissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvidenceSubmissionDto: UpdateEvidenceSubmissionDto) {
    return this.evidenceSubmissionService.update(+id, updateEvidenceSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evidenceSubmissionService.remove(+id);
  }
}
