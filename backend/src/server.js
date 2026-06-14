import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureAdminAccount } from "./modules/auth/auth.service.js";

const port = Number(process.env.PORT) || 5000;

const bootstrap = async () => {
  try {
    await connectDB();
    await ensureAdminAccount();

    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}.`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Another backend instance is already running. Stop it first or change PORT in backend/.env.`,
        );
        process.exit(1);
      }

      console.error("Failed to bind server.", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server.", error);
    process.exit(1);
  }
};

bootstrap();
