import 'reflect-metadata';
import express, {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes";
import { authMiddleware } from './middlewares/authMiddleware';
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI!;

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}))

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware ejecutado");
  console.log(req.body);
  next();
});

app.use(cookieParser());



app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const connectToDb = async () => {
    try {
        await mongoose.connect(mongoUri, {
        });
        console.log('MongoDB conectado');

    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error}`);
    }
}
connectToDb();