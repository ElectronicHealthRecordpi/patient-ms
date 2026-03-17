import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenderModule } from './gender/gender.module';
import { BloodTypeModule } from './blood-type/blood-type.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [GenderModule, BloodTypeModule, PatientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
