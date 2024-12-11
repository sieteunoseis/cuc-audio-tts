import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ElevenLabsClient } from "elevenlabs";
import { customSelectStyles, selectClassNames } from "@/lib/select-styles";
import { useConfig } from '../config/ConfigContext';

const createOption = (label, value) => ({
  label,
  value: { displayName: label, objectId: value },
});

const greetingOptions = [
  { label: "Alternate", value: "Alternate" },
  { label: "Busy", value: "Busy" },
  { label: "Closed", value: "Closed" },
  { label: "Error", value: "Error" },
  { label: "Holiday", value: "Holiday" },
  { label: "Internal", value: "Internal" },
  { label: "Standard", value: "Standard" },
];

const enableOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const config = useConfig();

  // Connection state
  const [connectionState, setConnectionState] = useState({
    connections: [],
    callHandlerData: [],
    isLoading: true,
  });

  // Call handler options state
  const [callHandlerOptions, setCallHandlerOptions] = useState({
    options: [],
    isLoading: false,
    selected: null,
  });

  // Form state
  const [formState, setFormState] = useState({
    greetingType: null,
    selectedVoice: null,
    ttsText: "",
    voices: [],
    isEnabled: null,
  });

  // Submit progress state
  const [submitProgress, setSubmitProgress] = useState({
    isSubmitting: false,
    progress: 0,
  });

  const apiBaseUrl = `http://localhost:${config.backendPort}/api/data`;
  const apiCupiUrl = `cupi?schema=handlers&objectId=callhandlers`;

  const simulateProgress = () => {
    setSubmitProgress((prev) => ({ ...prev, progress: 0, isSubmitting: true }));

    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev.progress >= 95) {
          clearInterval(interval);
          return prev;
        }
        return {
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 95),
        };
      });
    }, 500);

    return interval;
  };

  const handleCreate = (inputValue) => {
    setCallHandlerOptions((prev) => ({ ...prev, isLoading: true }));

    setTimeout(() => {
      const newOption = createOption(inputValue);
      setCallHandlerOptions((prev) => ({
        ...prev,
        isLoading: false,
        options: [...prev.options, newOption],
        selected: newOption,
      }));
    }, 1000);
  };

  const handleSubmit = async () => {
    // Find the selected connection
    const selectedConnection = connectionState.connections.find((conn) => conn.selected === "YES");

    if (!selectedConnection || !callHandlerOptions.selected || !formState.greetingType || !formState.selectedVoice || !formState.ttsText || formState.isEnabled === null) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields or no connection selected",
        variant: "destructive",
      });
      return;
    }

    const progressInterval = simulateProgress();

    try {
      const response = await fetch(`${apiBaseUrl}/update-callhandler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionData: selectedConnection, // Pass the entire connection object
          callHandler: callHandlerOptions.selected.value,
          greetingType: formState.greetingType.value,
          voice: { name: formState.selectedVoice.label, id: formState.selectedVoice.value },
          text: formState.ttsText,
          isEnabled: formState.isEnabled.value, // Add the enable option to the request
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update call handler");
      }

      setSubmitProgress({ progress: 100, isSubmitting: false });
      clearInterval(progressInterval);

      toast({
        title: "Success",
        description: "Call handler updated successfully",
      });
    } catch (error) {
      console.error("Error updating call handler:", error);
      clearInterval(progressInterval);
      setSubmitProgress({ progress: 0, isSubmitting: false });

      toast({
        title: "Error",
        description: "Failed to update call handler",
        variant: "destructive",
      });
    }
  };

  // Fetch voices from ElevenLabs
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const client = new ElevenLabsClient({
          apiKey: config.elevenLabsApiKey,
        });
        const data = await client.voices.getAll();
        const voiceOptions = data.voices.map((voice) => ({
          label: voice.name,
          value: voice.voice_id,
        }));
        setFormState((prev) => ({ ...prev, voices: voiceOptions }));
      } catch (error) {
        console.error("Error fetching voices:", error);
        toast({
          title: "Error fetching voices",
          description: "Could not fetch available voices",
          variant: "destructive",
        });
      }
    };

    fetchVoices();
  }, []);

  // Fetch initial connections
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(apiBaseUrl);
        const data = await response.json();
        setConnectionState((prev) => ({
          ...prev,
          connections: data,
          isLoading: false,
        }));

        if (data.length === 0) {
          toast({
            title: "No connections found",
            description: "Redirected to the connections page, please add a new connection.",
            variant: "destructive",
            duration: 3000,
          });
          navigate("/connections");
        }
      } catch (error) {
        navigate("/error");
      }
    };

    fetchResults();
  }, [apiBaseUrl, navigate]);

  // Fetch call handlers
  useEffect(() => {
    if (connectionState.connections.length === 0) return;

    const fetchCupiResults = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/${apiCupiUrl}`);
        const data = await response.json();

        const newOptions = data.Callhandler.map((handler) => createOption(handler.DisplayName, handler.ObjectId));

        setCallHandlerOptions((prev) => ({
          ...prev,
          options: [...prev.options, ...newOptions],
        }));

        setConnectionState((prev) => ({
          ...prev,
          callHandlerData: data,
        }));
      } catch (error) {
        navigate("/error");
      }
    };

    fetchCupiResults();
  }, [apiBaseUrl, apiCupiUrl, connectionState.connections]);

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-black">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Cisco Unity Greetings TTS</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">Configure text-to-speech greetings for your Cisco Unity call handlers. Select a call handler, greeting type, and voice to generate custom announcements.</p>

      <div className={`space-y-5 ${submitProgress.isSubmitting ? "opacity-50" : ""}`}>
        <CreatableSelect
          className="mt-5"
          isClearable
          placeholder="Select Call Handler..."
          isDisabled={callHandlerOptions.isLoading || submitProgress.isSubmitting}
          isLoading={callHandlerOptions.isLoading}
          onChange={(newValue) => setCallHandlerOptions((prev) => ({ ...prev, selected: newValue }))}
          onCreateOption={handleCreate}
          options={callHandlerOptions.options}
          value={callHandlerOptions.selected}
          styles={customSelectStyles}
          classNames={selectClassNames}
        />

        {callHandlerOptions.selected && <Select className="mt-5" placeholder="Select Greeting Type..." value={formState.greetingType} onChange={(selected) => setFormState((prev) => ({ ...prev, greetingType: selected }))} options={greetingOptions} isDisabled={submitProgress.isSubmitting} styles={customSelectStyles} classNames={selectClassNames} />}

        {formState.greetingType && <Select className="mt-5" placeholder="Select Voice..." value={formState.selectedVoice} onChange={(selected) => setFormState((prev) => ({ ...prev, selectedVoice: selected }))} options={formState.voices} isDisabled={submitProgress.isSubmitting} styles={customSelectStyles} classNames={selectClassNames} />}

        {formState.selectedVoice && (
          <>
            <Textarea className="mt-5" placeholder="Enter greeting text..." value={formState.ttsText} onChange={(e) => setFormState((prev) => ({ ...prev, ttsText: e.target.value }))} disabled={submitProgress.isSubmitting} rows={5} />
            <Select className="mt-5" placeholder="Enable Greeting..." value={formState.isEnabled} onChange={(selected) => setFormState((prev) => ({ ...prev, isEnabled: selected }))} options={enableOptions} isDisabled={submitProgress.isSubmitting} styles={customSelectStyles} classNames={selectClassNames} />

            {submitProgress.isSubmitting && (
              <div className="mt-4 space-y-2">
                <Progress value={submitProgress.progress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">Processing greeting... {Math.round(submitProgress.progress)}%</p>
              </div>
            )}

            <Button className="mt-3" onClick={handleSubmit} disabled={submitProgress.isSubmitting}>
              {submitProgress.isSubmitting ? "Processing..." : "Save Greeting"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
