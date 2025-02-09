import express from "express";

const PORT = 3555;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
