import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";

export const metadata = {
  title: "",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang='id'>
      <PluginInit/>
      <body>{ children }</body>
    </html>
  );
}
