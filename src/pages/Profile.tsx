
import React from "react";
import { Helmet } from "react-helmet-async";
import UserProfile from "@/components/profile/UserProfile";

export default function Profile() {
  return (
    <>
      <Helmet>
        <title>Profile | ConnectEd</title>
      </Helmet>
      <UserProfile />
    </>
  );
}
