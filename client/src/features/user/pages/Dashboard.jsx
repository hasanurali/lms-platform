import { useState } from "react";

import { Box } from "@mui/material"

import Sidebar from "@/components/navigation/Sidebar";
import ProfileTab from "../components/ProfileTab";
import CoursesTab from "../components/CoursesTab";
import useStore from "@/store/store"


const MOCK_USER = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  name: "Sarah Miller",
  email: "sarah.miller@example.com",
  bio: "Passionate learner exploring editorial design, typography, and sustainable architecture.",
  profilePicture: "https://api.dicebear.com/9.x/identicon/svg?seed=sarah",
  role: "student",
  createdAt: "2026-01-15T10:30:00Z",
  updatedAt: "2026-05-03T10:30:00Z",
};

const Dashboard = () => {

  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  return (
    <Box className="flex min-h-screen bg-slate-50 w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={MOCK_USER} />

      <Box component="main" className="md:ml-64 flex-1 pt-20 pb-12 px-6 md:px-10">
        <Box className="max-w-7xl mx-auto">
          {activeTab === "profile" && <ProfileTab user={MOCK_USER} />}
          {activeTab === "courses" && <CoursesTab />}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;