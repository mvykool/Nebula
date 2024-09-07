import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../hooks/authProvider";
import { useNavigate } from "react-router";

interface FormData {
  name: string;
  username: string;
  email: string;
  picture: string | null;
}

const Profile = () => {
  const { user, defaultPfp, updateUser } = useAuth();
  const navigate = useNavigate();

  //view state

  const [isModified, setIsModified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    picture: null,
  });

  const [initData, setInitData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    picture: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // end of view state

  useEffect(() => {
    if (user) {
      const userData = {
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        picture: user?.picture || "",
      };
      setFormData(userData);
      setInitData(userData);
      setPreviewUrl(user?.picture || null);
    }
  }, [user]);

  //temporal goback btn
  const goBack = () => {
    navigate("/");
  };

  //detect change
  const formModified = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:3000/upload/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = "http://localhost:3000" + data.url;

          setFormData((prev) => ({ ...prev, picture: imageUrl }));
          setPreviewUrl(imageUrl);
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    const isChanged = Object.keys(formData).some(
      (key) =>
        formData[key as keyof FormData] !== initData[key as keyof FormData],
    );
    setIsModified(isChanged);
  }, [formData, initData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isModified && !isLoading) {
      setIsLoading(true);
      try {
        const updatedUser = await updateUser(formData);
        if (updatedUser) {
          setFormData(updatedUser);
          setInitData(updatedUser);
          setIsModified(false);
          setPreviewUrl(updatedUser.picture || null);
        }
      } catch (error) {
        console.error("Error during patch request:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const prefixImage = formData?.picture;
  console.log(prefixImage);

  return (
    <>
      <div className="w-full h-16 flex justify-center items-center">
        {/*Logo*/}
        <div className="flex gap-2 text-black dark:text-white">
          <i className="bx bxs-analyse text-xl text-primary"></i>
          <p className="font-bold text-lg">
            Neb<span className="text-primary">u</span>la
          </p>
        </div>
      </div>

      {/*main section*/}
      <div className="relative w-5/6 mx-auto mt-10">
        <button
          onClick={goBack}
          type="button"
          className="text-black dark:text-white flex items-center bg-hover dark:bg-opacity-20 px-3 py-1 rounded-md gap-1"
        >
          <i className="bx bx-left-arrow-alt text-xl"></i>
          back
        </button>
        <div className=" flex border border-hover rounded-md justify-between mt-8 py-20 w-4/6 mx-auto">
          <div className="w-6/12 flex flex-col justify-center gap-6 mt-10">
            <img
              crossOrigin="anonymous"
              src={prefixImage || previewUrl || defaultPfp}
              alt="profile-picture"
              className="mx-auto rounded-full m-1 h-56 w-56 outline outline-black dark:outline-hover outline-2 outline-offset-4"
            />

            <label
              className="mx-auto bg-primary p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer"
              htmlFor="file-upload"
            >
              Change profile picture
            </label>

            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          <div className="w-6/12 p-4">
            <h3 className="my-5 font-extrabold text-lg text-black dark:text-white">
              Update Profile
            </h3>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col text-black dark:text-white"
            >
              <label className="font-semibold">Name</label>
              <input
                type="text"
                name="name"
                onChange={formModified}
                value={formData.name}
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <label className="font-semibold">Username</label>
              <input
                type="text"
                onChange={formModified}
                name="username"
                value={formData.username}
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <label className="font-semibold">Email</label>
              <input
                type="text"
                name="email"
                onChange={formModified}
                value={formData.email}
                className="w-5/6 mb-4 mt-1 rounded-md py-1 px-2 text-black"
              />
              <button
                type="submit"
                disabled={!isModified}
                className={`w-5/6 py-2 font-semibold rounded-md mt-3 ${!isModified ? "bg-invalid cursor-not-allowed" : "bg-highlight cursor-pointer"}`}
              >
                {isLoading ? "updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
