import { useState } from "react";

import { Box } from "@mui/material"

import Sidebar from "@/components/navigation/Sidebar";
import ProfileTab from "../components/ProfileTab";
import CoursesTab from "../components/CoursesTab";
import useStore from "@/store/store"
import useAuthUser from "@/features/auth/hooks/useAuthUser";

const Dashboard = () => {

  const { data: user, isPending } = useAuthUser();

  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  if (isPending) {
    return <div className="pt-20">Loding...</div>
  }

  return (
    <Box className="flex min-h-screen bg-slate-50 w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <Box component="main" className="md:ml-64 flex-1 pt-20 pb-12 px-6 md:px-10">
        <Box className="max-w-7xl mx-auto">
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "courses" && <CoursesTab />}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;