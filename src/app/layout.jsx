import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";

// Third-party
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang='id'>
      <PluginInit/>
      <body>
        { children }
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
