import { useOutletContext } from "react-router-dom";
const Page = () => {
  const { projectData } = useOutletContext();

  return (
    <div>
      <h2>single page</h2>
    </div>
  );
};

export default Page;
