import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";



const app = express();
const port = process.env.PORT || 4000
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",  // or your frontend URL
  credentials: true
}));


// API Endpoints
app.get("/", (req, res)=> res.send("API Working "));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server started on PORT:${port}`);
});

