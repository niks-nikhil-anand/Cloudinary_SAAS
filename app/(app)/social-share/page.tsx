"use client"
import React , {useState , useEffect , useRef} from 'react'
import { CldImage } from 'next-cloudinary';


const socialFormats = {
  "Facebook Post (1:1)": {
    width: 120,
    height: 120,
    aspectRatio: "1:1", // Square aspect ratio
  },
  "Facebook cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78", // Square aspect ratio
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1", // Rectangular aspect ratio
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9", // Rectangular aspect ratio
  },
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1", // Square aspect ratio
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5", // Square aspect ratio
  },
  "Pinterest Portrait (2:3)": {
    width: 200,
    height: 300,
    aspectRatio: "2:3", // Portrait aspect ratio
  },
};


type SocialFormat = keyof typeof socialFormats;


export default function socialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); 
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)"); 
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement >(null);

  useEffect(()=>{
    if(uploadedImage){
      setIsTransforming(true);
    }
  }, [selectedFormat , uploadedImage])

  const handleFileUpload = async(event : React.ChangeEvent<HTMLInputElement>) =>{
    const file = event.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file" , file);

    try {
      const response = await fetch("/api/image-upload" ,{
        method:"POST",
        body:formData
      })

      if(!response.ok){
        throw new Error("Failed to upload to Image")
      }

      const data = await response.json();
        setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload a image")
    }finally{
      setIsUploading(false);
    }

  }

  const handleDownload = () => {
    if(!imageRef.current) return ;
     fetch(imageRef.current.src)
     .then((response) => response.blob())
     .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedFormat
        .replace(/\s+/g,"_")
        .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(link);
        document.body.removeChild(link)
     }) .catch((error) => {
      console.error("Error downloading the image:", error);
    });
  }


  return (
    <div className='container mx-auto p-4  '>
      <h1 className='text-3xl font-bold text-center'>
        Social Media Image Creator
        </h1>

        <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Upload an Image</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Choose an image file</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>
              </div>
              </div>


    </div>
  )
}

 