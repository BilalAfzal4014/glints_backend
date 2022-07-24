import express, {Application, Router} from "express";
import restaurantRoutes from "./resturant";
import collectionRoutes from "./collection";
import userRoutes from "./user";


const setupRoutes = (app: Application) => {
    const router: Router = express.Router();
    router.use("/restaurants", restaurantRoutes);
    router.use("/collections", collectionRoutes);
    router.use("/users", userRoutes);
    app.use("/v1", router);
};

export default {
    setupRoutes
};
