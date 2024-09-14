import Sidebar from "../../components/sidebar";
import { useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { useEffect, useState } from "react";

const Project = () => {
  const { projectId } = useParams();
  const { fetchProject } = useProject();
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProject(projectId);
        setData(result);
        console.log(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [projectId, fetchProject]);

  return (
    <div className="w-full flex">
      {/*SIDE BAR*/}
      <Sidebar />
      <p>{projectId}</p>

      {/* MAIN CONTENT */}
      <div>
        {data}
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
