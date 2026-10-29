import mongoose, {Schema} from 'mongoose';

// so we bringing the jwt and bcrypt libraries to hash the password and create a token for the user
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String, // cloudinary url
            required: true
        },

        coverImage: {
            type: String, // cloudinary url
        },

        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String,
        },


    },
    {
        timestamps: true
    }
)
//Pre
// Pre middleware functions are executed one after another.

// You can also use a function that returns a promise, including async 
// functions. Mongoose will wait until the promise resolves to move on to 
// the next middleware.


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// methods is where you define custom functions that can be called on individual Mongoose documents.
// designing custom methods for the user model to generate a token and compare password

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//An access token is a credential that a client can send with requests to access protected resources.

// For example, after Rahul logs in, the server generates an access token. Rahul sends 
// it when requesting his profile or other protected resources.

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// A refresh token is used to obtain a new access token when the access token expires, 
// without requiring the user to enter their password again.

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)