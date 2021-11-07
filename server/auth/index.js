const jwt = require("jsonwebtoken")

//This function verifies if a token exists already. If it does, then automatically logins in the token
//The current bug checks the token on refresh/load. there is no token bc no one is signed in. Therefore, change so that
//if there is no token, just stop the call and return nothing. This can be caught here or in client/src/auth/index.js/auth.getLoggedIn

function authManager() {
    verify = function (req, res, next) {
        try {
            const token = req.cookies.token;
            //console.log(req.cookies.token)
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                errorMessage: "Unauthorized"
            });
        }
    }
    signToken = function (user) {
        return jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;