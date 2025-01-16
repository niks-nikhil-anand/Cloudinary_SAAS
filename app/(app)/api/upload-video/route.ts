import {NextRequest , NextResponse} from 'next/server'
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';



cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEYS, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


interface CloudinaryUploadResult{
    public_id:String,
    [key:string]:any
}

export async function POST(request:NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error:"Unauthorised"} , {status:401})
    }

   try {
        const formData = request.formData();

        const file = formdata.get("file") as File || null ;


        if(!file){
            return NextResponse.json({error:"File Not Found"} , {status:400})
        }


        const bytes = file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        await new Promise<CloudinaryUploadResult>(
            (resolve , reject)=>{
                cloudinary.uploader.upload_stream(
                    
                )
            }
        )
   } catch (error) {
    
   } 
}