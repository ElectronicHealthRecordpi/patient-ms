import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { plainToInstance } from 'class-transformer';
import { CreatePatientDto } from './dto/create-patient.dto';
import { validate } from 'class-validator';

describe('PatientController', () => {
  let patientController: PatientController;
  let patientService: PatientService;

  const createPatientDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    patientController = module.get<PatientController>(PatientController);
    patientService = module.get<PatientService>(PatientService);
  });
  describe('create', () => {
    it('should create a patient', async () => {
      jest.spyOn(patientService, 'create').mockResolvedValue(createPatientDto as any);
      expect(await patientController.create(createPatientDto)).toBe(createPatientDto);
    });
  });
  describe('findAll', () => {
    it('should return list of patients', async () => {
      const result = { message: 'pacientes obtenidos', data: [createPatientDto] };
      jest.spyOn(patientService, 'findAll').mockResolvedValue(result as any);
      expect(await patientController.findAll()).toBe(result);
    });
  });

});