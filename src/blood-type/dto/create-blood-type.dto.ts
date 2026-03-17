import { IsEnum, IsNotEmpty } from 'class-validator';
import { BloodTypeList } from "../enum/blood-type.enum";
import { BloodTypeEnum } from "@prisma/client";

export class CreateBloodTypeDto {
    @IsEnum(BloodTypeEnum, {
        message: `Los valores permitidos para el tipo de sangre son: ${BloodTypeList.join(', ')}`,
    })
    @IsNotEmpty({ message: 'El campo tipo de sangre no puede estar vacío' })
    name: BloodTypeEnum;
}
