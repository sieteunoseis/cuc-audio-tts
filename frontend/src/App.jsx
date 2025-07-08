import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home"; // Create your pages
import Connections from "./pages/Connections"; // Create your pages
import ErrorPage from "./pages/Error";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gray-100 dark:bg-black">
        <Router>
          <Toaster />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Router>
        <ModeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;