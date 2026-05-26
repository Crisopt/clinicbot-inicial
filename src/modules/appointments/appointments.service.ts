// src/modules/appointments/appointments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { reminderQueue } from '../../queues/queue';
import dayjs from 'dayjs';

export class CreateAppointmentDto {
  patientId: string;
  appointmentAt: string; // ISO date string
  notes?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAppointmentDto) {
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

  private async scheduleReminders(appointment: any) {
    const appointmentDate = dayjs(appointment.appointmentAt);
    const now = dayjs();

    // Regra 1: Admin — notificado 2 dias após o cadastro
    const adminDelay = now.add(2, 'day').diff(now);

    await reminderQueue.add(
      'send-admin-reminder',
      { appointmentId: appointment.id },
      {
        delay: adminDelay > 0 ? adminDelay : 0,
        jobId: `admin-${appointment.id}`,
      },
    );

    // Regra 2: Paciente — notificado 2 dias antes da consulta
    const patientTrigger = appointmentDate.subtract(2, 'day');
    const patientDelay = patientTrigger.diff(now);

    if (patientDelay > 0) {
      await reminderQueue.add(
        'send-patient-reminder',
        { appointmentId: appointment.id },
        {
          delay: patientDelay,
          jobId: `patient-${appointment.id}`,
        },
      );
    }

    console.log(`Jobs agendados para ${appointment.patient.name}`);
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: { patient: true },
      orderBy: { appointmentAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const apt = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!apt) throw new NotFoundException('Agendamento não encontrado');
    return apt;
  }

  async remove(id: string) {
    // Remove jobs da fila também
    const adminJob = await reminderQueue.getJob(`admin-${id}`);
    const patientJob = await reminderQueue.getJob(`patient-${id}`);
    await adminJob?.remove();
    await patientJob?.remove();

    return this.prisma.appointment.delete({ where: { id } });
  }

  async getQueueStatus() {
    const waiting = await reminderQueue.getWaiting();
    const delayed = await reminderQueue.getDelayed();
    const completed = await reminderQueue.getCompleted();
    const failed = await reminderQueue.getFailed();

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
}
