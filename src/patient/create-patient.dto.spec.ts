import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePatientDto } from './dto/create-patient.dto';


describe('CreatePatientDto', () => {

    const validDto = {
        name: "Carlos",
        lastName: "Mamani",
        age: 35,
        ci: "12345678",
        phone: "71234567",
        genderId: 1,
        bloodTypeId: 2,
        latitude: -17.3895,
        longitude: -66.1568
    };

    it('should reject empty name', async () => {
        const dto = plainToInstance(CreatePatientDto, { ...validDto, name: null });
        const errors = await validate(dto);
        expect(errors.some(e => e.property === 'name')).toBe(true);
    });

    it('should reject negative age', async () => {
        const dto = plainToInstance(CreatePatientDto, { ...validDto, age: -10 });
        const errors = await validate(dto);
        expect(errors.some(e => e.property === 'age')).toBe(true);
    });

});