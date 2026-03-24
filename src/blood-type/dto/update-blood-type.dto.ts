import { PartialType } from '@nestjs/mapped-types';
import { CreateBloodTypeDto } from './create-blood-type.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateBloodTypeDto extends PartialType(CreateBloodTypeDto) {
    @IsNumber()
    @IsPositive()
    id: number;
}
