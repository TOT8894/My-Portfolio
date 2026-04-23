import Contact from "../model/contactModel.js";
import { sendContactEmail } from "../emailService/emailService.js";
export const contactme = async(req,res)=>{
    try{
        const {fullname,email,phone,message}=req.body
        if(!fullname || !email || !phone || !message){
            return res.status(400).json({message:"All fields are required"})
        }
        if(fullname.length < 6 || phone.length < 10 || message.length < 10){
            return res.status(400).json({message:"Please provide valid input"})
        }
        const contact = new Contact({fullname,email,phone,message})
        await contact.save()
        await sendContactEmail (fullname, email, phone, message);
        res.status(200).json({message:"Contact message sent successfully"})
    }
    catch(error){
        res.status(500).json({message:"Error sending contact message", error:error.message})
    }

}
