// just to handler the errors : 
// Short Notes: ApiError Class (Node.js / Express.js)
// Definition: ApiError is a custom error class that extends 
// JavaScript's built-in Error class to handle API errors in a consistent format.

class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors =[],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = this.errors

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export{ApiError}