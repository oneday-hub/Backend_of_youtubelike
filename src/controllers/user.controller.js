import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: 'ok'
    })
})

// error : 2 - The login route needs an exported handler to register with Express.
const login = asyncHandler(async (req, res) => {
    res.status(501).json({
        message: 'Login is not implemented yet'
    });
});


export { registerUser, login };
