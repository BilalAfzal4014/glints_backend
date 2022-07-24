import express, {Router, Request, Response} from "express";
import FetchRestaurantModule from "../../../usecases/restaurant/fetch-module"
import HttpResponseHandler from "../../../errors/handlers/http-error-response-handler";
import jwtVerification from "../../middlewares/jwt-verification";

const router: Router = express.Router();

router.get('/:type', jwtVerification(), (req: Request, res: Response) => {
    return FetchRestaurantModule.fetchModuleWithPagination(JSON.parse(req.params.type), req.user_info.id)
        .then((data) => {
            return res.status(200).json(data);
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        });
});


export default router;