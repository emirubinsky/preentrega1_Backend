import express from "express";
import fs from "fs";

const cartsRouter = express.Router();

cartsRouter.post("/", async (req, res) => {
    try {
        const rawData = fs.readFileSync("./carrito.json");
        const carritos = JSON.parse(rawData);
        
        // Genera un nuevo ID autoincrementable
        const newCartId = carritos.length + 1;
        
        // Verifica si el cuerpo de la solicitud contiene la lista de productos
        if (!req.body || !Array.isArray(req.body.products)) {
            return res.status(400).json({ error: "Campos vacíos o inválidos en el request.body.products" });
        }

        // Estructura del nuevo carrito con el array de productos vacío
        const newCart = {
            id: newCartId,
            products: []
        };
        
        // Si se proporcionan productos, los agrega al carrito
        if (req.body.products.length > 0) {
            // Verifica que cada producto tenga tanto el ID del producto como la cantidad
            const isValidProducts = req.body.products.every(product => product.id && product.quantity);
            if (!isValidProducts) {
                return res.status(400).json({ error: "Cada producto debe tener un ID y una cantidad" });
            }
            
            // Agrega los productos al carrito
            newCart.products = req.body.products.map(product => ({
                id: product.id,
                quantity: product.quantity
            }));
        }
        
        // Agrega el nuevo carrito al array de carritos
        carritos.push(newCart);
        
        // Guarda el array actualizado de carritos en el archivo JSON
        fs.writeFileSync("./carrito.json", JSON.stringify(carritos, null, 2));

        res.status(201).json({ message: "Carrito creado exitosamente", cart: newCart });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


cartsRouter.get("/getCarts", async (req, res) => {
    try {
        const rawData = fs.readFileSync("./carrito.json");
        const carritos = JSON.parse(rawData);

        let result = carritos;
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);

        const rawData = fs.readFileSync("./carrito.json");
        const carritos = JSON.parse(rawData);

        const cart = carritos.find(cart => cart.id === cid);

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Cantidad invalida" });
        }

        const rawData = fs.readFileSync("./carrito.json");
        let carritos = JSON.parse(rawData);

        const cartIndex = carritos.findIndex(cart => cart.id === cid);

        if (cartIndex === -1) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productToAdd = {
            product: pid,
            quantity: parseInt(quantity)
        };

        const existingProductIndex = carritos[cartIndex].products.findIndex(item => item.product === pid);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, se actualiza la cantidad
            carritos[cartIndex].products[existingProductIndex].quantity += parseInt(quantity);
        } else {
            // Si el producto no existe en el carrito, se agrega al arreglo de productos
            carritos[cartIndex].products.push(productToAdd);
        }

        fs.writeFileSync("./carrito.json", JSON.stringify(carritos, null, 2));

        res.json({ message: "Producto agregado al carrito exitosamente", cart: carritos[cartIndex] });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default cartsRouter;