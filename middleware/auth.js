const crypto = require("../helpers/crypto.js");

function auth(req,res,next){
    const access_token = req.cookies.access_token || req.cookies.refresh_token;
    
    const verify_token = crypto.verifyToken(access_token);
    if(verify_token){
        if(verify_token.userID !== req.body.userID){
            res.status(401).send();
            return;
        } 
        res.locals.user_name = verify_token.user_name;
        res.locals.userID = verify_token.userID;
        next();
        return;
    } 
    res.redirect(307,'/auth/refresh_access/'+"?referrer="+req.originalUrl);
    
}

module.exports = {
    authMiddleware: auth
}