// require('dotenv').config({path: './env'}) 
// this will but we using es module js hence 

// just do this and look at line 14, 15, 16 you will able to do without : require()
import dotenv from "dotenv";

import mongoose  from "mongoose";
import { DB_NAME } from "./constants.js";


// this is approach 2 : connect function that is connectDB is in index2.js
import connectDB from "./db/index2.js";

dotenv.config({
    path: "./.env"
});

connectDB()


// lets talk about so search npm dotenv 
/*read this from documentation

As early as possible in your application, import and configure dotenv:

// index.js
require('dotenv').config()
// or import 'dotenv/config' // for esm

hence look at line 1
*/ 










/*
import mongoose  from "mongoose";
import { DB_NAME } from "./constants";

import express from "express"
const app = express()
// this is approach ONE : but more professional can be done
// function connectDB(){}
// connectDB() OR USING async and await 

(async () =>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // listeners
        app.on("errror", (error) =>{
            console.log("ERRROR : ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env. PORT}`);
        })


    }catch(error){
        console.error("ERROR : ", error)
        throw err
    }
})()
    */



