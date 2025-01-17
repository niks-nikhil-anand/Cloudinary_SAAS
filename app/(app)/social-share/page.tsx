"use client"
import React , {useState , useEffect , useRef} from 'react'
import { CldImage } from 'next-cloudinary';


const SocialFormat = {
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



const socialShare = () => {
  return (
    <div>socialShare</div>
  )
}

export default socialShare