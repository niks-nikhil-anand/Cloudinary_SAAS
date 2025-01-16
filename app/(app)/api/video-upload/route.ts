import {NextRequest , NextResponse} from 'next/server'
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()



cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEYS, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


interface CloudinaryUploadResult{
    public_id:string,
    byte: number,
    duration?: number,
    [key:string]:any
}

export async function POST(request:NextRequest){
   
   try {

        const {userId} =  await auth();

        if(!userId){
            return NextResponse.json({error:"Unauthorised"} , {status:401})
        }

        // Await formData parsing
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const originalSize = formData.get('originalSize') as string | null;



        

        if(!file){
            return NextResponse.json({error:"File Not Found"} , {status:400})
        }


        const bytes = file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve , reject)=>{
               const uploadStream cloudinary.uploader.upload_stream(
                   {
                    resource_type: "video",
                    folder:"clodinary-saas-video",
                    transformation:[
                       { 
                        quality:"auto" ,
                        fetch_format :"mp4"
                       }

                    ]

                } 
                   (error , result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                   }
                )
                uploadStream.end(buffer);
            }
        )
        return NextResponse.json({publicId : result.public_id} , {status : 200})
   } catch (error) {
    console.log("Upload image failed" , error)

    NextResponse.json({error: "Uploading Image is failed"} , {status : 500})
   } 
}