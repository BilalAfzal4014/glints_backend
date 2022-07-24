import express, {Router, Request, Response} from "express";
import SaveUser from "../../../usecases/user/save";
import Login from "../../../usecases/user/login";
import HttpResponseHandler from "../../../errors/handlers/http-error-response-handler";

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => {
    return (new SaveUser(req.body)).save()
        .then((data) => {
            return res.status(200).json(data);
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        });
});

router.post('/login', (req: Request, res: Response) => {
    return (new Login(req.body)).login()
        .then((data) => {
            return res.status(200).json(data);
        }).catch((error) => {
            return new HttpResponseHandler(res).handleError(error);
        });
});


export default router;