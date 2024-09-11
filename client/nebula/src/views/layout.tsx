import Navbar from "../components/navbar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-4/6 mx-auto">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
