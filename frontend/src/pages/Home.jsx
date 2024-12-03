import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import Creatable, { useCreatable } from 'react-select/creatable';

const Home = () => {
  const { toast } = useToast()
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const apiBaseUrl = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/api/data`;

  useEffect(() => {
    // Replace with your API URL
    const fetchResults = async () => {
      try {
        const response = await fetch(apiBaseUrl);
        const data = await response.json();
        setConnections(data);
        if (data.length === 0) {
          toast({
            title: "No connections found",
            description: "Redirected to the connections page, please add a new connection.",
            variant: "destructive",
            duration: 3000
          })
          navigate("/connections"); // Redirect if no results
        }
      } catch (error) {
        navigate("/error"); // Redirect to an error page if needed
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [apiBaseUrl, navigate]);

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-black">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Cisco Unity Greetings TTS</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Boilerplate code for a full-stack application using React, Express and Tailwind CSS. This project is built with Vite, a modern build tool that is blazing fast and supports React, Vue, Svelte and vanilla JavaScript. The backend is a simple Express server that serves data to the frontend. The frontend is a React app that uses Tailwind CSS for styling. The project is set up with ESLint, Prettier and Stylelint for code quality. The project also includes a dark mode toggle and a toast notification system.
      </p>
    </div>
  );
};

export default Home;