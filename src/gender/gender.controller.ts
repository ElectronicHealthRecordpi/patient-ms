import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) { }

  // @Post()
  @MessagePattern({ cmd: 'create-gender' })
  create(@Body() createGenderDto: CreateGenderDto) {
    // console.log('Received create-gender message:', createGenderDto);
    return this.genderService.create(createGenderDto);
  }

  @Get()
  findAll() {
    return this.genderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genderService.findOne(+id);
  }


}
