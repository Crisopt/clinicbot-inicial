"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = exports.CreateAppointmentDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const queue_1 = require("../../queues/queue");
const dayjs_1 = require("dayjs");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const appointment = await this.prisma.appointment.create({
            data: {
                patientId: data.patientId,
                appointmentAt: new Date(data.appointmentAt),
                notes: data.notes,
            },
            include: { patient: true },
        });
        await this.scheduleReminders(appointment);
        return appointment;
    }
    async scheduleReminders(appointment) {
        const appointmentDate = (0, dayjs_1.default)(appointment.appointmentAt);
        const now = (0, dayjs_1.default)();
        const adminDelay = now.add(2, 'day').diff(now);
        await queue_1.reminderQueue.add('send-admin-reminder', { appointmentId: appointment.id }, {
            delay: adminDelay > 0 ? adminDelay : 0,
            jobId: `admin-${appointment.id}`,
        });
        const patientTrigger = appointmentDate.subtract(2, 'day');
        const patientDelay = patientTrigger.diff(now);
        if (patientDelay > 0) {
            await queue_1.reminderQueue.add('send-patient-reminder', { appointmentId: appointment.id }, {
                delay: patientDelay,
                jobId: `patient-${appointment.id}`,
            });
        }
        console.log(`Jobs agendados para ${appointment.patient.name}`);
    }
    async findAll() {
        return this.prisma.appointment.findMany({
            include: { patient: true },
            orderBy: { appointmentAt: 'asc' },
        });
    }
    async findOne(id) {
        const apt = await this.prisma.appointment.findUnique({
            where: { id },
            include: { patient: true },
        });
        if (!apt)
            throw new common_1.NotFoundException('Agendamento não encontrado');
        return apt;
    }
    async remove(id) {
        const adminJob = await queue_1.reminderQueue.getJob(`admin-${id}`);
        const patientJob = await queue_1.reminderQueue.getJob(`patient-${id}`);
        await adminJob?.remove();
        await patientJob?.remove();
        return this.prisma.appointment.delete({ where: { id } });
    }
    async getQueueStatus() {
        const waiting = await queue_1.reminderQueue.getWaiting();
        const delayed = await queue_1.reminderQueue.getDelayed();
        const completed = await queue_1.reminderQueue.getCompleted();
        const failed = await queue_1.reminderQueue.getFailed();
        return {
            waiting: waiting.length,
            delayed: delayed.length,
            completed: completed.length,
            failed: failed.length,
            jobs: delayed.map((j) => ({
                id: j.id,
                name: j.name,
                data: j.data,
                processAt: new Date(Date.now() + (j.opts.delay || 0)).toISOString(),
            })),
        };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map