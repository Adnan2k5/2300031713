import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(bodyParser.json(), { urlencoded: true });

app.listen(PORT, () => {
  console.log(`service is running on port ${PORT}`);
});
