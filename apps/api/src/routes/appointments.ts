import type { FastifyInstance } from "fastify";
import { prisma } from "@nexosalud/db";
import type { CreateCitaBody, UpdateCitaEstadoBody } from "../types/index.ts";

export default async function AppointmentsRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    const { pacienteId, medicoId, estado } = request.query as Record<
      string,
      string
    >;
    return prisma.cita.findMany({
      where: {
        ...(pacienteId && { pacienteId: Number(pacienteId) }),
        ...(medicoId && { medicoId: Number(medicoId) }),
        ...(estado && { estado: estado as any }),
      },
      include: { paciente: true, medico: true },
      orderBy: { fechaHora: "asc" },
    });
  });

  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const cita = await prisma.cita.findUnique({
      where: { id: Number(req.params.id) },
      include: { paciente: true, medico: true, historial: true },
    });
    if (!cita) return reply.code(404).send({ error: "Cita no encontrada" });
    return cita;
  });

  app.post<{ Body: CreateCitaBody }>("/", async (req, reply) => {
    const cita = await prisma.cita.create({
      data: {
        ...req.body,
        fechaHora: new Date(req.body.fechaHora),
      },
      include: { paciente: true, medico: true },
    });
    return reply.code(201).send(cita);
  });

  app.patch<{ Params: { id: string }; Body: UpdateCitaEstadoBody }>(
    "/:id/estado",
    async (req, reply) => {
      try {
        return await prisma.cita.update({
          where: { id: Number(req.params.id) },
          data: { estado: req.body.estado },
        });
      } catch {
        return reply.code(404).send({ error: "Cita no encontrada" });
      }
    },
  );

  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    try {
      await prisma.cita.delete({ where: { id: Number(req.params.id) } });
      return { message: "Cita eliminada correctamente" };
    } catch {
      return reply.code(404).send({ error: "Cita no encontrada" });
    }
  });
}
