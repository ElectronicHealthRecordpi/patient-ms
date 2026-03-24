import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BloodTypeService } from './blood-type.service';
import { CreateBloodTypeDto } from './dto/create-blood-type.dto';
import { UpdateBloodTypeDto } from './dto/update-blood-type.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('blood-type')
export class BloodTypeController {
  constructor(private readonly bloodTypeService: BloodTypeService) { }

  // @Post()
  @MessagePattern({ cmd: 'create-blood-type' })
  create(@Payload() createBloodTypeDto: CreateBloodTypeDto) {
    return this.bloodTypeService.create(createBloodTypeDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find-all-blood-types' })
  findAll() {
    return this.bloodTypeService.findAll();
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find-one-blood-type' })
  findOne(@Payload('id') id: number) {
    return this.bloodTypeService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update-blood-type' })
  update(
    // @Payload('id', ParseIntPipe) id: number,
    @Payload() updateBloodTypeDto: UpdateBloodTypeDto,
  ) {
    return this.bloodTypeService.update(updateBloodTypeDto.id, updateBloodTypeDto);
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.bloodTypeService.remove(id);
  // }
}
