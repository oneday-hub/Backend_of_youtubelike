import {Router} from 'express'; 
import { logoutUser, registerUser} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = Router(); 

router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser
);


// now we writing the login router:
router.route("/login").post(loginUser)


// secured routes
router.route("/logout").post(verifyJWT, logoutUser) 
// now before running the logoutUser 
// verifyJWT that why we use next() in middlewares
// that tell to run first verifyJWT then logoutUser



export default router; 