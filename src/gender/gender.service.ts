import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GenderService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("Gender Service")
  async onModuleInit() {
    await this.$connect();
    this.logger.log("Conectado a la base de datos")
  }

  create(createGenderDto: CreateGenderDto) {
    return this.gender.create({
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

  public genderExists(id: number) {
    return this.gender.findUnique({ where: { id } });
  }
}
