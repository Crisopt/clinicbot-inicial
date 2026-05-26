import { AppointmentsService, CreateAppointmentDto } from './appointments.service';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(body: CreateAppointmentDto): Promise<{
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
    queueStatus(): Promise<{
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
}
