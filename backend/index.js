import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./db/index.js";
import VerifyJWT from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())

app.use("/api/user", userRouter);

app.get("/api/home", VerifyJWT, (req, res) => {
  res.send("hello");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
