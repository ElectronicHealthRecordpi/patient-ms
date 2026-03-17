import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBloodTypeDto } from './dto/create-blood-type.dto';
import { UpdateBloodTypeDto } from './dto/update-blood-type.dto';

@Injectable()
export class BloodTypeService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('BloodType Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado a la base de datos');
  }

  create(createBloodTypeDto: CreateBloodTypeDto) {
    return this.bloodType.create({
      data: {
        name: createBloodTypeDto.name,
      },
    });
  }

  findAll() {
    return this.bloodType.findMany();
  }

  async findOne(id: number) {
    const bloodType = await this.bloodType.findUnique({ where: { id } });
    if (!bloodType) {
      throw new NotFoundException(`Tipo de sangre con id ${id} no encontrado`);
    }
    return bloodType;
  }

  async update(id: number, updateBloodTypeDto: UpdateBloodTypeDto) {
    await this.findOne(id);
    return this.bloodType.update({
      where: { id },
      data: { name: updateBloodTypeDto.name },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.bloodType.delete({ where: { id } });
  }
}
