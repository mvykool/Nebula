/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useProject } from "../../hooks/useProject"

const CreateProject = () => {
  const [input, setInput] = useState({
    name: "",
    cover: "",
    description: ""
  })

  const project = useProject();

  const handleSubmit = async (e: any) => {
    e.PreventDefault();

    if (input.name !== "" && input.description !== "") {
      console.log('random', project)
    }
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h2>New Project</h2>

      <form action="" onSubmit={handleSubmit}>
        <input type="text" onChange={handleInput} />
      </form>
    </>
  )
}

export default CreateProject
