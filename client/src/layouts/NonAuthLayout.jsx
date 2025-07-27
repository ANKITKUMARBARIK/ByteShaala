import { Outlet } from "react-router-dom";

function NonAuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Outlet />
    </div>
  );
}

export default NonAuthLayout;
