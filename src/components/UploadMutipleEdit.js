import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { PRESIGNED_URL } from "../constants/api";
import { URL_PHOTO_AW3_01, COLOR_APP, COLOR_APP_CANCEL } from "../constants";
import { errorAdd } from "../helpers/sweetalert";

export default function UploadMultipleEdit({ src = [], onChange }) {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState("");
  const fileInputRef = useRef(null);

  // Sync images when src changes (for edit case)
  useEffect(() => {
    if (Array.isArray(src) && src.length > 0) {
      // Check if src contains full URLs or just file names
      const isFullUrl = src.every((item) => item.startsWith("http"));
      if (isFullUrl) {
        setSelectedImages(src);
      } else {
        // Convert file names to full URLs
        const fullUrls = src.map((s) => `${URL_PHOTO_AW3_01}${s}`);
        setSelectedImages(fullUrls);
      }
    } else {
      setSelectedImages([]);
    }
  }, [src]);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedImages.length > 5) {
      errorAdd("ສາມາດອັບໂຫຼດໄດ້ພຽງ 5 ຮູບເທົ່ານັ້ນ");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Invalid file type. Please upload only PNG, JPEG, or JPG images.");
      return;
    }

    try {
      const newUrls = [];
      const newFileNames = [];

      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const responseUrl = await axios.post(PRESIGNED_URL, {
          name: fileData.type,
        });

        await axios.put(responseUrl.data.url, fileData, {
          headers: {
            "Content-Type": fileData.type, // Use actual file type
            "Access-Control-Allow-Origin": "*",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImageLoading(
              `Uploading ${i + 1}/${files.length}: ${percentCompleted}%`
            );
          },
        });

        const url = responseUrl.data.url.split("?")[0];
        newUrls.push(url);
        newFileNames.push(url.split("/").pop());
      }

      const updatedImages = [...selectedImages, ...newUrls];

      console.log("newUrls", newUrls);
      console.log("newFileNames", newFileNames);
      console.log("updatedImages", updatedImages);

      setSelectedImages(updatedImages);
      setImageLoading("");
      // Update parent component (Formik)
      onChange({
        urls: updatedImages,
        names: updatedImages.map((u) => u.split("/").pop()),
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageLoading("Error uploading images. Please try again.");
    }
  };

  const handleRemoveImage = (index) => {
    const newUrls = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newUrls);
    onChange({ urls: newUrls, names: newUrls.map((u) => u.split("/").pop()) });
  };

  const handleRemoveImageAll = () => {
    setSelectedImages([]);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        hidden
        ref={fileInputRef}
      />
      <Button onClick={() => fileInputRef.current.click()} className="mb-2">
        <FontAwesomeIcon icon={faPlus} /> {t("add")}
      </Button>

      {selectedImages?.length > 1 && (
        <Button
          type="button"
          style={{
            backgroundColor: COLOR_APP_CANCEL,
            color: "#ffff",
          }}
          onClick={handleRemoveImageAll}
          className="mb-2 ml-2"
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: "8px" }} />
          {t("delete_image_slide")}
        </Button>
      )}

      <div className="grid grid-cols-3 gap-2">
        {selectedImages.map((url, index) => (
          <div key={url} className="relative">
            <img
              src={url}
              alt=""
              className="rounded-md w-[160px] h-[160px] object-cover"
            />
            {/* <img
              src={`https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/medium/${url}`}
              alt=""
              className="rounded-md w-[160px] h-[160px] object-cover"
            /> */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center"
              onClick={() => handleRemoveImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {imageLoading && (
        <div className="progress mt-2" style={{ height: 20 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${
                imageLoading.includes("%") ? imageLoading.split(" ")[2] : "100"
              }%`,
              backgroundColor: COLOR_APP,
            }}
            aria-valuenow={
              imageLoading.includes("%") ? imageLoading.split(" ")[2] : "100"
            }
            aria-valuemin="0"
            aria-valuemax="100"
            tabIndex="0"
          >
            {imageLoading}
          </div>
        </div>
      )}
    </div>
  );
}
