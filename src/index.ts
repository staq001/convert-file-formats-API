import express from "express";
import { router as pdfToWordRouter } from "../src/routers/pdftoword.routers";
import { router as wordRouter } from "../src/routers/word.routers";
import { router as dlRouter } from "../src/routers/download.routers";
import path from "node:path";

const PORT = process.env.PORT || 3555;

const app = express();

app.use(express.static("./public"));

app.use(express.json());
app.use(pdfToWordRouter);
app.use(wordRouter);
app.use(dlRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
