import React, { useEffect, useState } from "react";
import DataForm from "../components/DataForm";
import DataTable from "../components/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await fetch(`/api/data`);
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataAdded = () => {
    fetchData(); // Refresh data when new data is added
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-6">Manage Connections</h1>
        <Card className="mb-8 w-full">
          <CardHeader>
            <CardTitle>Add New Connection</CardTitle>
            <CardDescription>
              Create a new connection to your Cisco Unity system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm onDataAdded={handleDataAdded} />
          </CardContent>
        </Card>
        {data.length === 0 ? (
          <p className="text-gray-600 text-center">No connections available.</p>
        ) : (
          <div>
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mt-6 mb-2">Saved Connections</h1>
            <DataTable data={data} onDataChange={fetchData} />
          </div>
        )}
    </div>
  );
}

export default App;
