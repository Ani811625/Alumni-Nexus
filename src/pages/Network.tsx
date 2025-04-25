
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeopleConnect from '@/components/networking/PeopleConnect';
import UserSearch from '@/components/networking/UserSearch';

const Network = () => {
  const [activeTab, setActiveTab] = useState("connections");

  return (
    <div className="container mx-auto my-6 px-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-1">Network</h1>
            <p className="text-muted-foreground">
              Connect with alumni, students, and faculty
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="connections">My Connections</TabsTrigger>
            <TabsTrigger value="search">Find People</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="connections">
          <PeopleConnect />
        </TabsContent>
        
        <TabsContent value="search">
          <UserSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Network;
