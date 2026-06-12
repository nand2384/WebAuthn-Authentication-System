import express from "express";
import cors from "cors";
import env from "./config/env";
import cookieParser from "cookie-parser";

import appContext from "./appContext";
import healthRoutes from "./routes/health.routes";
import requestLogger from "./middleware/requestLogger.middleware";
import errorMiddleware from "./middleware/error.middleware";
import requestId from "./middleware/requestId.middleware";
import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";

const app = express();

app.use(cors({
  origin: process.env.EXPECTED_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use(requestId);
app.use(requestLogger);

app.use(cookieParser());

app.use('/health', healthRoutes(appContext));
app.use('/auth', authRoutes(appContext));
app.use('/patients', patientRoutes(appContext));

app.use(errorMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  appContext.loggerService.info(`Server is running on port ${PORT}`);
});