import express, {Router, Request, Response} from "express";
import SaveCollection from "../../../usecases/collection/save";
import CollectionRestaurantMapping from "../../../usecases/collection/restaurant-mapping";
import HttpResponseHandler from "../../../errors/handlers/http-error-response-handler";
import jwtVerification from "../../middlewares/jwt-verification";
import FetchCollection from "../../../usecases/collection/fetch";

const router: Router = express.Router();

router.post('/', jwtVerification(), (req: Request, res: Response) => {
    return (new SaveCollection({
        ...req.body,
        user_id: req.user_info.id
    })).save()
        .then(() => {
            return res.status(200).json({});
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        })
});

router.post('/toggle', jwtVerification(), (req: Request, res: Response) => {
    return (new CollectionRestaurantMapping(req.body)).toggle()
        .then(() => {
            return res.status(200).json({});
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        })
});

router.get('/', jwtVerification(), (req: Request, res: Response) => {
    return FetchCollection.fetch(req.user_info.id)
        .then((data) => {
            return res.status(200).json(data);
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        })
});

router.get('/:id', jwtVerification(), (req: Request, res: Response) => {
    return FetchCollection.fetchSingle(req.user_info.id, req.params.id)
        .then((data) => {
            return res.status(200).json(data);
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        })
});

export default router;