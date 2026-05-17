import { Outlet } from "react-router-dom";

const Container = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Outlet />
    </div>
  );
};

export default Container;
