// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthController } from './health.controller';

import { PrismaService } from './prisma/prisma.service';
import { PatientsController } from './modules/patients/patients.controller';
import { PatientsService } from './modules/patients/patients.service';
import { AppointmentsController } from './modules/appointments/appointments.controller';
import { AppointmentsService } from './modules/appointments/appointments.service';
import { WhatsappService } from './modules/whatsapp/whatsapp.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
  ],
  controllers: [PatientsController, HealthController, AppointmentsController],
  providers: [PrismaService, PatientsService, AppointmentsService, WhatsappService],
})
export class AppModule {}
