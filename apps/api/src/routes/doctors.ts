import type { FastifyInstance } from "fastify";
import { prisma } from "@nexosalud/db";
import type { CreateMedicoBody } from "../types/index.ts";

export default async function DoctorsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return prisma.medico.findMany({ orderBy: { apellido: "asc" } });
  });

  app.get<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const medico = await prisma.medico.findUnique({
      where: { id: Number(req.params.id) },
      include: { citas: { include: { paciente: true } } },
    });
    if (!medico) return reply.code(404).send({ error: "Médico no encontrado" });
    return medico;
  });

  app.post<{ Body: CreateMedicoBody }>("/", async (req, reply) => {
    const medico = await prisma.medico.create({ data: req.body });
    return reply.code(201).send(medico);
  });

  app.put<{ Params: { id: string }; Body: Partial<CreateMedicoBody> }>(
    "/:id",
    async (req, reply) => {
      try {
        return await prisma.medico.update({
          where: { id: Number(req.params.id) },
          data: req.body,
        });
      } catch {
        return reply.code(404).send({ error: "Médico no encontrado" });
      }
    },
  );

  app.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    try {
      await prisma.medico.delete({ where: { id: Number(req.params.id) } });
      return { message: "Médico eliminado correctamente" };
    } catch {
      return reply.code(404).send({ error: "Médico no encontrado" });
    }
  });
}
