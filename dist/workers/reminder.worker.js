"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const bullmq_1 = require("bullmq");
const client_1 = require("@prisma/client");
const axios_1 = require("axios");
const prisma = new client_1.PrismaClient();
async function sendWhatsApp(phone, message) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    if (!token || !phoneId) {
        console.log(`[SIMULADO] → ${phone}: ${message}`);
        return;
    }
    const url = `https://graph.facebook.com/v22.0/${phoneId}/messages`;
    await axios_1.default.post(url, {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}
const worker = new bullmq_1.Worker('reminders', async (job) => {
    console.log(`[Worker] Processando job: ${job.name} | id: ${job.id}`);
    const appointment = await prisma.appointment.findUnique({
        where: { id: job.data.appointmentId },
        include: { patient: true },
    });
    if (!appointment) {
        console.warn(`Agendamento não encontrado: ${job.data.appointmentId}`);
        return;
    }
    if (job.name === 'send-patient-reminder') {
        if (appointment.reminderSent) {
            console.log('Lembrete de paciente já enviado, pulando.');
            return;
        }
        await sendWhatsApp(appointment.patient.phone, `Olá ${appointment.patient.name}, lembramos que sua consulta está marcada para daqui 2 dias. Qualquer dúvida, entre em contato conosco.`);
        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSent: true },
        });
        console.log(`✓ Lembrete enviado ao paciente ${appointment.patient.name}`);
    }
    if (job.name === 'send-admin-reminder') {
        if (appointment.adminReminderSent) {
            console.log('Lembrete de admin já enviado, pulando.');
            return;
        }
        const masterPhone = process.env.MASTER_PHONE;
        if (!masterPhone) {
            console.warn('MASTER_PHONE não configurado. Pulando notificação de admin.');
            return;
        }
        await sendWhatsApp(masterPhone, `📋 Lembrete: O paciente ${appointment.patient.name} possui consulta em 2 dias (${new Date(appointment.appointmentAt).toLocaleDateString('pt-BR')}).`);
        await prisma.appointment.update({
            where: { id: appointment.id },
            data: { adminReminderSent: true },
        });
        console.log(`✓ Notificação enviada ao admin sobre ${appointment.patient.name}`);
    }
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    concurrency: 5,
});
worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} concluído com sucesso.`);
});
worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} falhou: ${err.message}`);
});
console.log('🤖 Worker de lembretes iniciado. Aguardando jobs...');
//# sourceMappingURL=reminder.worker.js.map