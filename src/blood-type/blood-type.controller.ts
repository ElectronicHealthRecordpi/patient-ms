import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BloodTypeService } from './blood-type.service';
import { CreateBloodTypeDto } from './dto/create-blood-type.dto';
import { UpdateBloodTypeDto } from './dto/update-blood-type.dto';

@Controller('blood-type')
export class BloodTypeController {
  constructor(private readonly bloodTypeService: BloodTypeService) { }

  @Post()
  create(@Body() createBloodTypeDto: CreateBloodTypeDto) {
    return this.bloodTypeService.create(createBloodTypeDto);
  }

  @Get()
  findAll() {
    return this.bloodTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bloodTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBloodTypeDto: UpdateBloodTypeDto,
  ) {
    return this.bloodTypeService.update(id, updateBloodTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bloodTypeService.remove(id);
  }
}
