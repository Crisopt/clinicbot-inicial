// src/modules/appointments/appointments.controller.ts
import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AppointmentsService, CreateAppointmentDto } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.create(body);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('queue/status')
  queueStatus() {
    return this.appointmentsService.getQueueStatus();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
