import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { GenderValuesList } from "../enum/gender.enum";
import { GenderEnum } from "@prisma/client";

export class CreateGenderDto {

    @IsString({
        message: 'El campo id debe ser una cadena de texto'
    })
    @IsEnum(GenderValuesList, {
        message: `los valores permitidos para el campo nombre son: ${GenderValuesList.join(', ')}`
    })
    @IsNotEmpty(
        {
            message: 'El campo nombre no puede estar vacío'
        }
    )
    name: GenderEnum
}
