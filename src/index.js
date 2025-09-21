import dotenv from "dotenv";
import connectToDatabase from "./database/index.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
