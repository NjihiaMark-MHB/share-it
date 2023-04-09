import AuthProvider from "./auth/provider";
import Navbar from "./components/navbar";
import QueryWrapper from "./components/wrappers/query-wrapper";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Share It",
  description: "Share your ideas with the world",
  VisualViewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*cloudinary upload widget */}
      <head>
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          defer
        ></script>
      </head>

      <body>
        <QueryWrapper>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </QueryWrapper>
      </body>
    </html>
  );
}
