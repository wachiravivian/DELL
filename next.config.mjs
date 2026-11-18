/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // builds plain HTML/CSS/JS into the "out" folder
  trailingSlash: true,     // /packages/ → packages/index.html, works well on cPanel
  images: { unoptimized: true },
};

export default nextConfig;