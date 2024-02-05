import express from "express";
import cors from "cors"
import { userRoutes } from "./routes/user"

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.listen(3000);

