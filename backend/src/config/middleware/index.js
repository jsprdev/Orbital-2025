const admin = require('.././firebase-config');

class Middleware {
    async handleRequest(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:', token);

        // Check if token is provided
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }
        
        // Verify the token
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = decodedToken;

            return next();
        
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).send('Internal Server Error');

        }
    }
}

module.exports = new Middleware();