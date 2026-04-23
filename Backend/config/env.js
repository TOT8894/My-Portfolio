import dotenv from "dotenv";
dotenv.config();
const MONGO_URI=process.env.MONGO_URI
const PORTNUM=process.env.PORT
const CLIENT_URL=process.env.CLIENT_URL
const EMAIL_USER=process.env.EMAIL_USER
const EMAIL_PASS=process.env.EMAIL_PASS

export {
    MONGO_URI,
    PORTNUM,
    CLIENT_URL,
    EMAIL_USER,
    EMAIL_PASS
}