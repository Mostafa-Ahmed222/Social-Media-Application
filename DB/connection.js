import mongoose from "mongoose";

const connectDB = async () => {
    return await mongoose.connect(process.env.DBURI)
        .then(() => console.log(`connected DB on ......... ${process.env.DBURI}`))
        .catch(err => console.log(`Fail toconnected DB on ......... ${err}`))

}
export default connectDB