import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt.ts";
import cors from "@fastify/cors";
import "dotenv/config";
import PatientsRoutes from "./routes/patitents.ts";
import DoctorsRoutes from "./routes/doctors.ts";
import AppointmentsRoutes from "./routes/appointments.ts";
import HistoryRoutes from "./routes/history.ts";
import authRoutes from "./routes/auth.ts";

const app = Fastify({ logger: true });
const start = async () => {
  try {
    await app.register(cors, { origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] });

    await app.register(jwtPlugin);

    app.register(authRoutes, { prefix: '/api/v1/auth' });
    app.register(PatientsRoutes, { prefix: "/api/v1/patients" });
    app.register(DoctorsRoutes, { prefix: "/api/v1/doctors" });
    app.register(AppointmentsRoutes, { prefix: "/api/v1/appointments" });
    app.register(HistoryRoutes, { prefix: "/api/v1/history" });

    app.get("/health", async () => ({ status: "ok", timestamp: new Date() }));

    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Servidor corriendo en el puerto 3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
