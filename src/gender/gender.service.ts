import { Injectable, OnModuleInit, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { PrismaClient } from '@prisma/client';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class GenderService extends BasePrismaService {
  protected readonly logger = new Logger(GenderService.name);
  async create(createGenderDto: CreateGenderDto) {
    const exists = await this.valueExists(this.gender, 'name', createGenderDto.name, 'nombre del genero');
    if (exists) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `Ya existe un genero con el nombre: ${createGenderDto.name}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.gender.create({
      data: {
        name: createGenderDto.name
      }
    });

  }

  findAll() {
    return this.gender.findMany();
  }

  findOne(id: number) {
    return this.gender.findUnique({
      where: { id }
    });
  }


}
