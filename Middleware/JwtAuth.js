const jwt = require('jsonwebtoken');

const secretKey = '2023';

exports.authenticateToken=function (req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;
    // const token = req.headers.authorization?.split(' ')[1];
console.log("enteredddddddddddd")
console.log(req.headers.authorization)
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        console.log("tryyyyyyyyyyyyyy")
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}
