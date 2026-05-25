import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BasePrismaService } from '../common/base-prisma.service';
import e from 'express';

@Injectable()
export class PatientService extends BasePrismaService {
  protected readonly logger = new Logger(PatientService.name);

  async create(createPatientDto: CreatePatientDto) {
    const { genderId, bloodTypeId } = createPatientDto;
    if (createPatientDto.latitude == null || createPatientDto.longitude == null) {
      createPatientDto.latitude = -17.3895;
      createPatientDto.longitude = -66.1568;
    }
    await this.ensureExists(this.gender, genderId, 'genero');
    await this.ensureExists(this.bloodType, bloodTypeId, 'tipo de sangre');
    const ciExists = await this.valueExists(this.patient, 'ci', createPatientDto.ci, 'ci del paciente');
    if (ciExists)
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `Ya existe un paciente con CI: ${createPatientDto.ci}`,
      });

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
    const { genderId, bloodTypeId, ci } = updatePatientDto;

    const patient = await this.findByIdOrFail(this.patient, id, 'paciente');

    if (patient.isDeleted)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No puedes modificar un paciente eliminado',
      });

    if (ci) {
      const existing = await this.patient.findUnique({ where: { ci } });
      if (existing && existing.id !== id) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: `Ya existe un paciente con CI: ${ci}`,
        });
      }
    }
    if (genderId) {
      await this.ensureExists(this.gender, genderId, 'genero');
    }

    if (bloodTypeId) {
      await this.ensureExists(this.bloodType, bloodTypeId, 'tipo de sangre');
    }

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
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Paciente con ci: ${patientFound.ci} ya eliminado`,
      });

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
  async getIdByCi(ci: string) {
    const patient = await this.patient.findFirst({
      where: { ci, isDeleted: false },
      select: { id: true }
    });
    console.log('Paciente encontrado:', patient);

    if (!patient) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `No se encontró un paciente con CI: ${ci}`,
    });
    return patient.id;

  }

  async findByCi(ci: string) {
    const patient = await this.patient.findFirst({
      where: { ci, isDeleted: false },
      include: { gender: true, bloodType: true },
    });

    if (!patient) throw new RpcException({
      status: HttpStatus.NOT_FOUND,
      message: `No se encontró un paciente con CI: ${ci}`,
    });

    return patient;
  }

  async getPatientLocations() {
    return this.patient.findMany({
      where: {
        isDeleted: false,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        latitude: true,
        longitude: true,
      },
    });
  }
}