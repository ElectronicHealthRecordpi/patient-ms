import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller()
export class PatientController {
  constructor(private readonly patientService: PatientService) { }
  @MessagePattern({ cmd: 'create-patient' })
  create(@Payload() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @MessagePattern({ cmd: 'find-all-patients' })
  findAll() {
    return this.patientService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-patient' })
  findOne(@Payload('id') id: string) {
    return this.patientService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-patient' })
  update(@Payload() data: { id: string } & UpdatePatientDto) {
    const { id, ...updatePatientDto } = data;
    return this.patientService.update(id, updatePatientDto);
  }

  @MessagePattern({ cmd: 'remove-patient' })
  remove(@Payload('id') id: string) {
    return this.patientService.remove(id);
  }
  @MessagePattern({ cmd: 'patients-get-id-by-ci' })
  getIdByCi(@Payload() data: { ci: string }) {
    console.log('CI recibido:', data);
    return this.patientService.getIdByCi(data.ci);
  }

  @MessagePattern({ cmd: 'find-patient-by-ci' })
  findByCi(@Payload() data: { ci: string }) {
    return this.patientService.findByCi(data.ci);
  }

  @MessagePattern({ cmd: 'epidemiology.get-patient-locations' })
  getPatientLocations() {
    return this.patientService.getPatientLocations();
  }
}
