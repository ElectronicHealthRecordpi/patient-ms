import { PartialType } from '@nestjs/mapped-types';
import { CreateBloodTypeDto } from './create-blood-type.dto';

export class UpdateBloodTypeDto extends PartialType(CreateBloodTypeDto) {}
