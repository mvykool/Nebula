import { useState, ChangeEvent } from "react";
import Loading from "./loading";
import { Project } from "../types/project.type";

interface UploadImageProps {
  setInput: React.Dispatch<React.SetStateAction<Project>>;
}

const UploadImage = ({ setInput }: UploadImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true); // Set loading state before starting upload
      const formData = new FormData();
      formData.append("file", file);

      const urlBase = import.meta.env.VITE_URL;

      try {
        const response = await fetch(`${urlBase}/upload/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.url;
          setInput((prev) => ({ ...prev, cover: imageUrl }));
          setPreviewUrl(imageUrl);
          setImageLoaded(false); // Reset image loaded state for new image
        } else {
          console.error("Image upload failed");
          alert("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      } finally {
        // Don't set isLoading to false here - we'll do that when the image actually loads
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false); // Only hide loading state when image is actually loaded
  };

  return (
    <>
      <div className="w-full relative flex flex-col gap-6">
        <div className="relative">
          {isLoading && (
            <div className=" flex items-end justify-center pt-32">
              <Loading />
            </div>
          )}

          {previewUrl && (
            <img
              crossOrigin="anonymous"
              src={previewUrl}
              alt="project-cover"
              className={`mx-auto relative h-[30vh] object-cover w-full border border-white outline outline-2 outline-offset-2 ${
                !imageLoaded ? "hidden" : ""
              }`}
              onLoad={handleImageLoad}
            />
          )}
        </div>

        <label
          className={`${
            previewUrl ? "mt-2" : "mt-20"
          } mx-auto bg-primary p-2 text-black dark:text-white font-semibold tracking-wide rounded-md text-sm cursor-pointer hover:bg-primary/90`}
          htmlFor="file-upload"
        >
          {previewUrl ? "Change project image" : "Add a project image"}
        </label>

        <input
          type="file"
          id="file-upload"
          name="cover"
          accept="image/*"
          className="hidden"
          onChange={handleImage}
        />
      </div>
    </>
  );
};
export default UploadImage;
