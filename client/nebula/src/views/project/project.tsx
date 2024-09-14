import Sidebar from "../../components/sidebar";
import { useParams } from "react-router";

const Project = () => {
  const { projectId } = useParams();

  return (
    <div className="w-full flex">
      {/*SIDE BAR*/}
      <Sidebar />
      <p>{projectId}</p>

      {/* MAIN CONTENT */}
      <div>
        <img src="#" alt="cover-image" />

        {/*TITLE*/}
        <h3>title</h3>

        {/*CONTENT*/}
        <p>content</p>
      </div>
    </div>
  );
};

export default Project;
