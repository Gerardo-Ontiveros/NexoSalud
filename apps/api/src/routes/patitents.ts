import type { FastifyInstance } from "fastify";
import { prisma } from "@nexosalud/db";
import type { CreatePacienteBody } from "../types/index.ts";


export default async function PatientsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return prisma.paciente.findMany({
      orderBy: { createdAt: "desc" },
    });
  });

  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(request.params.id) },
      include: {
        citas: { include: { medico: true } },
        historiales: { include: { medico: true } },
      },
    });
    if (!paciente)
      return reply.code(404).send({ error: " Paciente no encontrado" });
    return paciente;
  });

  app.post<{ Body: CreatePacienteBody }>("/", async (request, reply) => {
    const paciente = await prisma.paciente.create({
      data: {
        ...request.body,
        fechaNacimiento: new Date(request.body.fechaNacimiento),
      },
    });
    return reply.code(201).send(paciente);
  });

  app.put<{ Params: { id: string }; Body: Partial<CreatePacienteBody> }>(
    "/:id",
    async (request, reply) => {
      try {
        const paciente = await prisma.paciente.update({
          where: { id: Number(request.params.id) },
          data: {
            ...request.body,
            ...(request.body.fechaNacimiento && {
              fechaNacimiento: new Date(request.body.fechaNacimiento),
            }),
          },
        });
        return paciente;
      } catch {
        return reply.code(404).send({ error: "Paciente no encontrado" });
      }
    },
  );

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.paciente.delete({
        where: { id: Number(request.params.id) },
      });
      return reply
        .code(204)
        .send({ message: "Paciente eliminado exitosamente" });
    } catch {
      return reply.code(404).send({ error: "Paciente no encontrado" });
    }
  });
}
