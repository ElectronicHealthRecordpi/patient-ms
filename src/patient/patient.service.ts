import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BasePrismaService } from '../common/base-prisma.service';

@Injectable()
export class PatientService extends BasePrismaService {
  protected readonly logger = new Logger(PatientService.name);

  async create(createPatientDto: CreatePatientDto) {
    const { genderId, bloodTypeId } = createPatientDto;

    await this.ensureExists(this.gender, genderId, 'genero');
    await this.ensureExists(this.bloodType, bloodTypeId, 'tipo de sangre');
    return await this.patient.create({
      data: {
        ...createPatientDto,
        name: createPatientDto.name.trim().toLowerCase(),
        lastName: createPatientDto.lastName.trim().toLowerCase(),
      }
    })
  }

  async findAll() {
    const patients = await this.hasRecords(this.patient, 'pacientes', { isDeletedCheck: true });
    return patients;
  }

  async findOne(id: string) {
    const patient = await this.findByIdOrFail(this.patient, id, 'paciente');
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const { genderId, bloodTypeId } = updatePatientDto;

    if (genderId) {
      await this.ensureExists(this.gender, genderId, 'genero');
    }

    if (bloodTypeId) {
      await this.ensureExists(this.bloodType, bloodTypeId, 'tipo de sangre');
    }

    const patient = await this.findByIdOrFail(this.patient, id, 'paciente');

    if (patient.isDeleted)
      throw new BadRequestException('No puedes modificar un paciente eliminado');


    const updatedPatient = await this.patient.update({
      where: { id },
      data: {
        ...updatePatientDto,
        name: updatePatientDto.name?.trim().toLowerCase(),
        lastName: updatePatientDto.lastName?.trim().toLowerCase(),
      }
    });

    return updatedPatient;
  }
  async remove(id: string) {
    const patientFound = await this.findByIdOrFail(this.patient, id, 'paciente');
    if (patientFound.isDeleted)
      throw new BadRequestException(`Paciente con ci: ${patientFound.ci} ya eliminado`);

    const patient = await this.patient.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        ci: true,
        name: true,
        lastName: true
      }
    });

    return {
      message: `Paciente eliminado correctamente con CI: ${patient.ci}`,
      fullName: `${patient.name} ${patient.lastName}`
    };
  }
}

