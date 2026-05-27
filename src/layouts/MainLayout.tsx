import { Header, Sidebar, Container } from "./components";

const MainLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <Sidebar />
      <Container />
    </div>
  );
};

export default MainLayout;
