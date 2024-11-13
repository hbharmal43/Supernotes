import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;

	// If no token is provided, proceed without authentication
	if (!token) {
		console.log("No token provided - proceeding without authentication");
		req.userId = null; // You can set this to null or any default value if you need it elsewhere
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If the token is invalid, also allow the request to pass
		if (!decoded) {
			console.log("Invalid token - proceeding without authentication");
			req.userId = null;
			return next();
		}

		// If token is valid, set the user ID
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		// If there's an error (like token verification failure), proceed without authentication
		req.userId = null;
		next();
	}
};
