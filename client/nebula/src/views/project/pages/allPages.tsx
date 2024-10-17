import { useNavigate } from "react-router";
interface Iprops {
  pages: string[];
  id: string | undefined;
}

const AllPages = ({ pages, id }: Iprops) => {
  const navigate = useNavigate();

  const goPage = () => {
    navigate(`/projects/${id}/pages`);
  };

  return (
    <div>
      <div className="flex justify-between">
        <p>pages</p>{" "}
        <button onClick={goPage} type="button">
          add page
        </button>
      </div>
      {pages}
    </div>
  );
};

export default AllPages;
