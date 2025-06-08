import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app=express();
const PORT=process.env.PORT;

app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
// }));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});