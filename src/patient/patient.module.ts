import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { GenderService } from 'src/gender/gender.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
  
})
export class PatientModule {}
