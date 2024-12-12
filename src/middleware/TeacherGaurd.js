// TeacherGaurd.js (middleware)

import jwt from 'jsonwebtoken'; // Assuming you are using JWT for authentication

const TeacherGaurd = (req, res, next) => {
    try {
        // Get token from request headers (assuming it's passed as a Bearer token)
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).send({ message: 'No token provided' });
        }

        // Verify the token and extract user info
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have a JWT_SECRET in your environment variables
        req.user = decoded; // Attach user info to the request object

        // Check if the user is a teacher (assuming `role` is part of the decoded JWT payload)
        if (req.user.role !== 'teacher') {
            return res.status(403).send({ message: 'Unauthorized: Not a teacher' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(500).send({ message: 'Failed to authenticate token' });
    }
};

export default TeacherGaurd;
