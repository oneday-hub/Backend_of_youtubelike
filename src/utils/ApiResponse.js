/*
Short Notes: ApiResponse Class
Definition: ApiResponse is a custom class used to return 
API responses in a consistent format in Node.js/Express.js.

important points
Property	Purpose

statusCode	HTTP status code, e.g. 200, 201
data	    Actual response data
message	    Response message; defaults to "Success"
success	    true if status code is below 400, otherwise false

Remember the difference
- ApiResponse → structures successful API responses (by convention).
- ApiError → structures error information.
- res.status().json() → sends the HTTP response to the client.
Note: ApiResponse only creates an object. It does not send the response by itself.
*/

class ApiResponse{
    constructor(
        statusCode,
        data, 
        message= "Success"
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
