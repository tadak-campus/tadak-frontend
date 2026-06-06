import { Outlet } from "react-router-dom";
import { contentInner, contentShell } from "@design-system";

const Container = () => {
  return (
    <main className={contentShell}>
      <div className={contentInner}>
        <Outlet />
      </div>
    </main>
  );
};

export default Container;
