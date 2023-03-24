import JWT from 'jsonwebtoken';
import User from '../schemas/user.js';

const verifySeller = async (req, res, next) => {
    try {
        // const token = req.headers.cookie.split("=")[1];
        const token = req.cookies.vintagetoken; 


        if (token) {
            // const token = authHeader.split(" ")[1];
            const verified = JWT.verify(token, process.env.JWT_SEC_KEY);
            // console.log(verified)
            const currUser = await User.findOne({
                _id: verified.id,
                role:"SELLER"
            });


            if (!currUser) {
                return res.status(401).send("Unauthorized Seller")
            }

            req.token = token;
            let { password, ...rest } = currUser._doc;

            req.currUser = rest;
            req.userId = currUser._id;

            next();

        } else {
            return res.status(401).send("Please Login to Perform This")
        }
    } catch (err) {
        console.log(err);
        res.status(401).send("Unauthorized Seller");
    }
}
export default verifySeller