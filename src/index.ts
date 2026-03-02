import express, { Express } from "express";
import dotenv from "dotenv";
import offerRouter from "./routes/offer.routes";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 6000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", offerRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

