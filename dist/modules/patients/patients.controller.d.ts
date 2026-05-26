import { PatientsService, CreatePatientDto } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(body: CreatePatientDto): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        createdAt: Date;
    }>;
    findAll(): Promise<({
        appointments: {
            id: string;
            createdAt: Date;
            patientId: string;
            appointmentAt: Date;
            notes: string | null;
            reminderSent: boolean;
            adminReminderSent: boolean;
        }[];
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        createdAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        appointments: {
            id: string;
            createdAt: Date;
            patientId: string;
            appointmentAt: Date;
            notes: string | null;
            reminderSent: boolean;
            adminReminderSent: boolean;
        }[];
    } & {
        id: string;
        name: string;
        phone: string;
        email: string | null;
        createdAt: Date;
    }>;
    update(id: string, body: Partial<CreatePatientDto>): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        createdAt: Date;
    }>;
}
