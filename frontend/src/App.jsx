 import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "@/components/ui/sonner";

// Layout Components
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

// Main Page View
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1">
          <Routes>
            {/* The ONLY route in the entire application right now */}
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <SiteFooter />
        {/* <Toaster /> */}
      </div>
    </BrowserRouter>
  );
}