import express from "express";
import { router as pdfToWordRouter } from "../src/routers/pdftoword.routers";

const PORT = 3555;

const app = express();

app.use(express.json());
app.use(pdfToWordRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
