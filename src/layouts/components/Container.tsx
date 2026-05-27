import { Outlet } from "react-router-dom";
import { contentShell } from "@design-system";

const Container = () => {
  return (
    <main className={contentShell}>
      <Outlet />
    </main>
  );
};

export default Container;
