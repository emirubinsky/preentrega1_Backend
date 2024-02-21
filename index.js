import express from "express";
import http from "http";
import bodyParser from "body-parser";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();
const server = http.createServer(app);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Middleware adicional para analizar el cuerpo de la solicitud JSON en cartsRouter
cartRouter.use(bodyParser.json());

const PORT = 8080;

server.listen(PORT, () => {
    console.log("Servidor conectado!!");
});