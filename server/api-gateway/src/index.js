import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./.env" });

app.listen(process.env.PORT || 8888, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
});
