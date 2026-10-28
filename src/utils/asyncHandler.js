// Why put it in the utils folder?
// utils is a conventional place for utility functions: small, 
// reusable pieces of logic that help different parts of an application.


// we going to use asyncHandler promises wala not try and catch wala
// asyncHandler is higher order function : 
// which can use other function as a parameter and also can return 

// this is promises wala : 

const asyncHandler = (requestHandler) =>{
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}



// ----------------------------------------------------------------------
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

    // -------- this try and catch code ------------
// const asyncHandler = (fn) => async(req, res, next) => {
//     try{
//         await fn(req, res, next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }