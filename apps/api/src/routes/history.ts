import type { FastifyInstance } from "fastify";
import { prisma } from "@nexosalud/db";
import type { CreateHistorialBody } from "../types/index.ts";

export default async function HistoryRoutes(app: FastifyInstance) {
  app.get<{ Params: { pacienteId: string } }>(
    "/paciente/:pacienteId",
    async (request) => {
      return prisma.historialMedico.findMany({
        where: { pacienteId: Number(request.params.pacienteId) },
        include: { medico: true, cita: true },
        orderBy: { fecha: "desc" },
      });
    },
  );

  app.post<{ Body: CreateHistorialBody }>("/", async (request, reply) => {
    const historial = await prisma.historialMedico.create({
      data: {
        ...request.body,
        ...(request.body.fecha && { fecha: new Date(request.body.fecha) }),
      },
      include: { paciente: true, medico: true },
    });
    return reply.code(201).send(historial);
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.historialMedico.delete({
        where: { id: Number(request.params.id) },
      });
      return { message: "Registro eliminado correctamente" };
    } catch {
      return reply.code(404).send({ error: "Registro no encontrado" });
    }
  });
}
