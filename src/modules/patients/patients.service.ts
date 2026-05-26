// src/modules/patients/patients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export class CreatePatientDto {
  name: string;
  phone: string;
  email?: string;
}

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientDto) {
    return this.prisma.patient.create({ data });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: { appointments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { appointments: true },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async update(id: string, data: Partial<CreatePatientDto>) {
    return this.prisma.patient.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
