import mongoose from 'mongoose';

export const connectDb = async ()=>{

    try{
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDb connected : ${''}`)
    }catch (error) {
        console.log("Error : connection to db" ,error.message)
        process.exit(1)
    }
}


