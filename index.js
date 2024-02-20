import express from "express";
import http from "http";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();
const server = http.createServer(app);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

server.listen(8080,() => {
    console.log("Servidor conectado!!");
})