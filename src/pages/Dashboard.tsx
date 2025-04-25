
import React from "react";
import { Helmet } from "react-helmet-async";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard | ConnectEd</title>
      </Helmet>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <UserDashboard />
      </div>
    </>
  );
}
