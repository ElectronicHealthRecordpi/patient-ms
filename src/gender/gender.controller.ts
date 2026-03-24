import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) { }

  // @Post()
  @MessagePattern({ cmd: 'create-gender' })
  create(@Payload() createGenderDto: CreateGenderDto) {
    // console.log('Received create-gender message:', createGenderDto);
    return this.genderService.create(createGenderDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find-all-genders' })
  findAll() {
    return this.genderService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-gender' })
  // @Get(':id')
  findOne(@Payload('id') id: string) {
    return this.genderService.findOne(+id);
  }


}
