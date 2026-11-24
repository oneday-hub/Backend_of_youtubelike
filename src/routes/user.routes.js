import {Router} from 'express'; 
import {loginUser, 
        logoutUser, 
        registerUser, 
        refreshAccessToken, 
        changeCurrentPassword, 
        getCurrentUser, 
        updateAccountDetails, 
        updateUserAvatar, 
        updateUserCoverImage, 
        getUserChannelProfiles, 
        getWatchHistory} from '../controllers/user.controller.js';

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
router.route("/login").post(loginUser);


// secured routes
router.route("/logout").post(verifyJWT, logoutUser) ;
// now before running the logoutUser 
// verifyJWT that why we use next() in middlewares
// that tell to run first verifyJWT then logoutUser

router.route("/refresh-token").post(refreshAccessToken)
// we do not use verifyjwt because we have already did in refreshAcessToken function in controllers


router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyJWT, 
    upload.single("/coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfiles);

router.route("/history").get(verifyJWT, getWatchHistory);


export default router; 