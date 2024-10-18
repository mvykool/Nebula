import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";

const Page = () => {
  const [data, setData] = useState({
    title: "title",
    content: "",
  });

  const editor = useCreateBlockNote();

  return (
    <div className="w-full">
      <h2>{data.title}</h2>
      <BlockNoteView editor={editor} data-theming-css-variables-demo />
    </div>
  );
};

export default Page;
