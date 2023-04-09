/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com", "demos.creative-tim.com", "images.unsplash.com", "res.cloudinary.com", "cdn.pixabay.com"],
    formats: ["image/avif", "image/webp"],
  }
}

module.exports = nextConfig
