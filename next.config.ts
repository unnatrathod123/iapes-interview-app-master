import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**Add this line to Build this File*/
  output: 'export',
  
  /**To Optimize Image while building application */
  images: {
    unoptimized: true, // <--- ADD THIS LINE
  },

  /* config options here */
};

export default nextConfig;
