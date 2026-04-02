import jwt from "jsonwebtoken";

const generateToken = (user) =>{
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            organizationId: user.organizationId,
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    )
    return token;
}

export default generateToken;