import express, {Application} from "express";
const app: Application = express();

import middlewaresManager from './express/middlewares';
import routesManager from "./express/routes/index";

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
middlewaresManager.applyMiddlewares(app);
routesManager.setupRoutes(app);
middlewaresManager.applyErrorMiddlewares(app);
export default app;
