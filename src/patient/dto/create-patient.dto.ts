import {
    IsInt, IsNotEmpty, IsNumber, IsOptional,
    IsPositive, IsString, Matches, Max, MaxLength,
    Min, MinLength
} from "class-validator";

export class CreatePatientDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'Solo se permiten letras y espacios'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'Solo se permiten letras y espacios'
    })
    lastName: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(120)
    age: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    @Matches(/^[0-9]{5,10}[A-Za-z]{0,2}$/, {
        message: 'CI inválido'
    })
    ci: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(\+591)?[67]\d{7}$/, {
        message: 'Teléfono inválido (ej: 71234567 o +59171234567)'
    })
    phone: string;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    genderId: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    bloodTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;
}