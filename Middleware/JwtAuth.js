const jwt = require('jsonwebtoken');

const secretKey = '2023';

const authenticateToken = function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        checkRole(req, res, next).then((role) => {
            if (role === 'user') {
                return res.status(401).json("Access Denied");
            } else {
                next();
            }
        }).catch((error) => {
            res.status(500).json({ message: error.message });
        });

    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};


const validateToken = function (req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
                next();
        }catch(error)  {
            return res.status(403).json({ error: 'Invalid token' });


        }



};

const checkRole = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role === 'User') {
            return 'user';
        } else {
            return 'manager';
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    authenticateToken,
    checkRole,validateToken
};
