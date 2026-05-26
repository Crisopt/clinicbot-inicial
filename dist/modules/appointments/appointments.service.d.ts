import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateAppointmentDto {
    patientId: string;
    appointmentAt: string;
    notes?: string;
}
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAppointmentDto): Promise<{
        patient: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string;
        appointmentAt: Date;
        notes: string | null;
        reminderSent: boolean;
        adminReminderSent: boolean;
    }>;
    private scheduleReminders;
    findAll(): Promise<({
        patient: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string;
        appointmentAt: Date;
        notes: string | null;
        reminderSent: boolean;
        adminReminderSent: boolean;
    })[]>;
    findOne(id: string): Promise<{
        patient: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        patientId: string;
        appointmentAt: Date;
        notes: string | null;
        reminderSent: boolean;
        adminReminderSent: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        patientId: string;
        appointmentAt: Date;
        notes: string | null;
        reminderSent: boolean;
        adminReminderSent: boolean;
    }>;
    getQueueStatus(): Promise<{
        waiting: number;
        delayed: number;
        completed: number;
        failed: number;
        jobs: {
            id: string;
            name: string;
            data: any;
            processAt: string;
        }[];
    }>;
}
