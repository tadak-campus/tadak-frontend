import Header from "./Header";
import Sidebar from "./Sidebar";
import Container from "./Container";

const MainLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <div className="w-full h-full flex">
        <Sidebar />
        <Container />
      </div>
    </div>
  );
};

export default MainLayout;
