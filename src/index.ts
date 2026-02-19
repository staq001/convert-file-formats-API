import express from "express";
import { router as pdfToWordRouter } from "../src/routers/pdftoword.routers";
import { router as wordRouter } from "../src/routers/word.routers";
import { router as dlRouter } from "../src/routers/download.routers";

const PORT = process.env.PORT || 3555;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use(express.json());
app.use(pdfToWordRouter);
app.use(wordRouter);
app.use(dlRouter);

app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: "./public/pages" });
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
