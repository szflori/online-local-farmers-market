import { Router } from "express";
import { authRoutes, ordersRoutes, productsRoutes } from "./routes";


const router = Router();

// Alútvonalak összefűzése
router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);

export default router;