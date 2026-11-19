import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

/*auth.middleware.js middleware has one main responsibility:
Verify the access token and identify the user making the request. */

// isualize the flow
// JWT Access Token

// jwt.verify(token, secret)

// decodedToken

// { _id, email, iat, exp }

// User.findById(decodedToken._id)

// Find authenticated user in MongoDB

// Remember this important distinction:
// - jwt.decode() → Decodes a JWT but does not verify its signature.
// - jwt.verify() → Verifies the signature and expiration, then returns the decoded payload.
// In authentication middleware, we use jwt.verify() because we must verify that the token is trustworthy before identifying the user.
export const verifyJWT = asyncHandler(async(req, _, 
    next) => {

    try{
        const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next();

    }catch (error){
        throw new ApiError(401, error?.message || "Invalid access token")
    }



});