import express from "express";
import { router as pdfToWordRouter } from "../src/routers/pdftoword.routers";
import { router as wordRouter } from "../src/routers/word.routers";
import path from "node:path";

const PORT = process.env.PORT || 3555;

const app = express();
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(pdfToWordRouter);
app.use(wordRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
