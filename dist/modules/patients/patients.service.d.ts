import { PrismaService } from '../../prisma/prisma.service';
export declare class CreatePatientDto {
    name: string;
    phone: string;
    email?: string;
}
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePatientDto): Promise<{
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
    update(id: string, data: Partial<CreatePatientDto>): Promise<{
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
