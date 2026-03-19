import { Injectable, Logger } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BasePrismaService } from '../common/base-prisma.service';

@Injectable()
export class PatientService extends BasePrismaService {
  protected readonly logger = new Logger('Patient Service');

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

  findAll() {
    return this.patient.findMany();
  }

  findOne(id: string) {
    return this.patient.findUnique({
      where: { id }
    });
  }

  update(id: string, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: string) {
    return `This action removes a #${id} patient`;
  }
}

