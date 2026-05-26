"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const health_controller_1 = require("./health.controller");
const prisma_service_1 = require("./prisma/prisma.service");
const patients_controller_1 = require("./modules/patients/patients.controller");
const patients_service_1 = require("./modules/patients/patients.service");
const appointments_controller_1 = require("./modules/appointments/appointments.controller");
const appointments_service_1 = require("./modules/appointments/appointments.service");
const whatsapp_service_1 = require("./modules/whatsapp/whatsapp.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'frontend'),
                serveRoot: '/',
                exclude: ['/api*'],
            }),
        ],
        controllers: [patients_controller_1.PatientsController, health_controller_1.HealthController, appointments_controller_1.AppointmentsController],
        providers: [prisma_service_1.PrismaService, patients_service_1.PatientsService, appointments_service_1.AppointmentsService, whatsapp_service_1.WhatsappService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map