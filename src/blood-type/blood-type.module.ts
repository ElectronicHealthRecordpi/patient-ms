import { Module } from '@nestjs/common';
import { BloodTypeService } from './blood-type.service';
import { BloodTypeController } from './blood-type.controller';

@Module({
  controllers: [BloodTypeController],
  providers: [BloodTypeService],
})
export class BloodTypeModule {}
