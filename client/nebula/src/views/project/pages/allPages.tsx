interface Iprops {
  pages: string[];
}

const AllPages = ({ pages }: Iprops) => {
  return (
    <div>
      <div className="flex justify-between">
        <p>pages</p> <button type="button">add page</button>
      </div>
      {pages}
    </div>
  );
};

export default AllPages;
