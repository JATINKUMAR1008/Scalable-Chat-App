import http from "http";
import SocketService from "./services/socket";
import express from "express";
import { authRouter } from "./routes/auth-routes";
import bodyParser from "body-parser";
import cors from "cors";
import cloudinary from "cloudinary";
export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
async function init() {
  const socketService = new SocketService();
  const httpServer = http.createServer(app);
  app.use("/auth", authRouter);
  cloudinary.v2.config({
    cloud_name: "dhiykiupn",
    api_key: "892165484695834",
    api_secret: "tiTZByMY8QdZcYYk6VBs15x5ifw",
  });
  const PORT = process.env.PORT ? process.env.PORT : 4000;
  socketService.io.attach(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
  socketService.initListeners();
}
init();
