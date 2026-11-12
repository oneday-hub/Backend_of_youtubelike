import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

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

export { registerUser}