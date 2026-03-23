import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBloodTypeDto } from './dto/create-blood-type.dto';
import { UpdateBloodTypeDto } from './dto/update-blood-type.dto';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class BloodTypeService extends BasePrismaService {
  protected readonly logger = new Logger(BloodTypeService.name);


  async create(createBloodTypeDto: CreateBloodTypeDto) {
    const exists = await this.valueExists(this.bloodType, 'name', createBloodTypeDto.name, 'nombre del tipo de sangre');
    if (exists) {
      throw new NotFoundException(`Ya existe un tipo de sangre con el nombre: ${createBloodTypeDto.name}`);
    }
    return await this.bloodType.create({
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
    const exists = await this.valueExists(this.bloodType, 'name', updateBloodTypeDto.name, 'nombre del tipo de sangre', id);
    if (exists) {
      throw new BadRequestException(`Ya existe un tipo de sangre con el nombre: ${updateBloodTypeDto.name}`);
    }
    return this.bloodType.update({
      where: { id },
      data: { name: updateBloodTypeDto.name },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.bloodType.delete({ where: { id } });
  }
}
