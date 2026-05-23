import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div>
            Dashboard Layout
            <Outlet />
        </div>
    );
};

export default DashboardLayout;