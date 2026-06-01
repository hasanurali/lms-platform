import { Outlet } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";

const DashboardLayout = () => {
    return (
        <>
            <Navbar />
            <main className="flex">
                <Sidebar />
                <Outlet />
            </main>
        </>
    );
};

export default DashboardLayout;