import { Header, Sidebar, Container } from "@layouts/components";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-indigo-50">
      <Header />
      <Sidebar />
      <Container />
    </div>
  );
};

export default MainLayout;
