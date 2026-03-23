import { Injectable, OnModuleInit, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { PrismaClient } from '@prisma/client';
import { BasePrismaService } from 'src/common/base-prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GenderService extends BasePrismaService {
  protected readonly logger = new Logger(GenderService.name);
  async create(createGenderDto: CreateGenderDto) {
    const exists = await this.valueExists(this.gender, 'name', createGenderDto.name, 'nombre del genero');
    if (exists) {
      throw new RpcException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `Ya existe un genero con el nombre: ${createGenderDto.name}`,
        }
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
