import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"


const generateAcessTokenAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId); 
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { refreshToken, accessToken };

    }catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // -- steps : 
    // step 1 : get user details from frontend
    // step 2 : validation - not empty
    // step 3 : check if user already exists : through username, email
    // step 4 : check for images, check for avatar
    // step 5 : upload them to cloudinary, avatar 
    // step 6 : create user oject - create entry in db
    // step 7 : remove password and refresh token field from response
    // step 8 : check for user creation
    // step 9 : return response 

    // step 1 : get user details from frontend
    // look here we only handling the text but we need also to handle files
    // now read my_notes_step11.txt for file upload using multer middleware
    const {fullName, email, username, password} = req.body
    console.log("email : ", email );

    // now check for all the validation and writing if condition will 
    // take so much time so the better way to do it is :

    // if(fullName === ""){
    //     throw new ApiError(400, "Full name is required")
    // }
    
    // step 2 : validation - not empty (also in profession we while file for validation )
    if(
        [fullName, email, username, password].some((field) => 
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // step 3 : check if user already exists : through username, email
    const existedUser =  await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // console.log("req.files : ", req.files);

    // step 4 : check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // --------------------
    /*This code is checking whether the user has uploaded an avatar 
    (profile picture) and optionally a cover image during registration.
     */

    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // step 5 : upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(500, "Avatar file is required")
    }


    // step 6 : create user object - create entry in db
    const user = await User.create({
        fullName,
        // avatar: avatar.url,
        // coverImage: coverImage?.url || "",
        avatar,
        coverImage: coverImage || "",
        email,
        password, 
        username: username.toLowerCase()
    })

    // step 7 : remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // step 8 : check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // step 9 : return response 
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});


const loginUser = asyncHandler(async (req, res) => {
    // first write the todos :
    // step 1 : request body se data lao (username or email)
    // step 2 : find the user in db using username or email
    // step 3 : if user not found throw error 
    // step 4 : password match check using bcrypt
    // step 5 generate access token and refresh token using jwt and send to user
    // generally we send access token in response body and refresh token in cookie

    // step 6 : return response to user


    const {email, username, password} = req.body;

    if(!email && !username){
        throw new ApiError(400, "Email or username is required")
    }

    const user = await User.findOne(
    email ? { email } : { username }
    );

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(!password){
        throw new ApiError(400, "Password is required")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password")
    }

    // now step 5 : generate access token and refresh token using jwt and send to user 
    // now this step is so common so we will the function for it.

    // look at line no 7 

    const { refreshToken, accessToken } = await generateAcessTokenAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )
});


const logoutUser = asyncHandler(async (req, res) => {
    // now since the user is loggedin 
    // so just do req.user._id this gives you user from database 

    // how to write the professionally
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
});


/*
This controller is responsible for generating a new access token when 
the old access token expires.

It also generates a new refresh token. This process is called 
Refresh Token Rotation. 
*/
const refreshAccessToken = asyncHandler(async (req, res) => {
    // now we need to refresh the accessToken for that we need access of refreshToken
    // so for refreshToken we can access through cookies

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
    // in body because someone use mobile app for that we are using body

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    // now we need to verify the incoming token using jwt
    try {
        const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(400, "Invalid refresh Token")
    }

    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, newRefreshToken} = await generateAcessTokenAndRefreshTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )

    }catch(error){
        throw new ApiError(401, error?.message ||
            "Invalid refresh token"
        )
    }
});

export {registerUser, 
        loginUser, 
        logoutUser,
        refreshAccessToken}