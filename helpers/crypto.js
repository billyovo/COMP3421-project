const crypto = require('crypto');
var jwt = require('jsonwebtoken');
require('dotenv').config();

function SHA256(input){
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return hash;
}

function getRandomBytes(){
    return crypto.randomBytes(4).toString('hex'); 
}

function signRefreshToken(user_name, userID){
    return jwt.sign({
        user_name: user_name,
        userID: userID,
        type: "refresh"
    }, process.env.PRIVATE_KEY, { expiresIn: '14d' });
}

function signAccessToken(refresh_token){
    const decoded = verifyToken(refresh_token);
    if(decoded){
        return jwt.sign({
            user_name: decoded.user_name,
            userID: decoded.userID,
            type: "access"
        }, process.env.PRIVATE_KEY, { expiresIn: '12h' });
    }
    else{
        return null;
    }
}

function verifyToken(token, type){
    try{
        const decoded = jwt.verify(token,process.env.PRIVATE_KEY);
        if(type){
            return decoded.type === type ? decoded : null;
        }
        return decoded;
    }
    catch(error){
        return null;
    }
}
module.exports = {
    SHA256: SHA256,
    getRandomBytes: getRandomBytes,
    signRefreshToken: signRefreshToken,
    signAccessToken: signAccessToken,
    verifyToken: verifyToken
  }