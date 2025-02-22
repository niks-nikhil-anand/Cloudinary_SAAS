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
    console.log(formData);

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
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Remove the link only once
        window.URL.revokeObjectURL(url); // Revoke the URL to free up memory
      })
      .catch((error) => {
        console.error("Error downloading the image:", error);
      });
  };
  


  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
    Social Media Image Creator
  </h1>

      <div className="card">
      <div className="card-body bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="card-title mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Upload an Image
          </h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-800 dark:text-gray-100">
                Choose an image file
              </span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
           <div className="mt-6">
           <h2 className="card-title mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
             Select Social Media Format
           </h2>
           <div className="form-control">
             <select
               className="select select-bordered w-full px-4 py-2 rounded-lg text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={selectedFormat}
               onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
             >
               {Object.keys(socialFormats).map((format) => (
                 <option key={format} value={format} className="text-gray-800 dark:text-gray-100">
                   {format}
                 </option>
               ))}
             </select>
           </div>

           <div className="mt-6 relative bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md">
  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
    Preview:
  </h3>
  <div className="flex justify-center relative">
    {isTransforming && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-70 z-10 rounded-lg">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    )}
    <CldImage
      width={socialFormats[selectedFormat].width}
      height={socialFormats[selectedFormat].height}
      src={uploadedImage}
      sizes="100vw"
      alt="transformed image"
      crop="fill"
      aspectRatio={socialFormats[selectedFormat].aspectRatio}
      gravity="auto"
      ref={imageRef}
      onLoad={() => setIsTransforming(false)}
      className="rounded-lg border border-gray-300 dark:border-gray-600"
    />
  </div>
</div>


              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 