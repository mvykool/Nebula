import Sidebar from "../../components/sidebar";

const Project = () => {
  return (
    <div className="w-full flex">
      {/*SIDE BAR*/}
      <Sidebar />

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
