import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PatientService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("Patient Service")
  async onModuleInit() {
    await this.$connect();
    this.logger.log("Conectado a la base de datos")
  }
  create(createPatientDto: CreatePatientDto) {
    return this.patient.create({
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
