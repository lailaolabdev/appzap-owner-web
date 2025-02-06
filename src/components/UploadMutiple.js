import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PRESIGNED_URL } from "../constants/api";
import { COLOR_APP, COLOR_APP_CANCEL, URL_PHOTO_AW3 } from "../constants";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UploadMultiple({
  src,
  isInvalid,
  onChange,
  alt = "",
  removeImage,
  ...other
}) {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState("");
  const [urls, setUrls] = useState(src ? [URL_PHOTO_AW3 + src] : []);
  const fileInputRef = useRef(null);

  console.log("src", src);

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (files.length + selectedImages.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    setImageLoading("Uploading...");

    try {
      const newUrls = [];
      const newFileNames = [];

      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];

        // Get presigned URL
        const responseUrl = await axios.post(PRESIGNED_URL, {
          name: fileData.type,
        });

        // Upload file to S3
        const afterUpload = await axios.put(responseUrl.data.url, fileData, {
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

        const url = afterUpload.config.url.split("?")[0];
        newUrls.push(url);

        const fileName = url.substring(url.lastIndexOf("/") + 1);
        newFileNames.push(fileName);
      }

      setUrls([...urls, ...newUrls]);
      setSelectedImages([...selectedImages, ...Array.from(files)]);
      setImageLoading("");

      onChange({
        urls: [...urls, ...newUrls],
        names: [...newFileNames],
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageLoading("Error");
    }
  };

  const handleRemoveImage = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    setUrls(newUrls);
    setSelectedImages(newSelectedImages);
    onChange({
      urls: newUrls,
      names: newSelectedImages.map((file) => file.name),
    });
  };
  const handleRemoveImageAll = () => {
    setUrls([]);
    setSelectedImages([]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        // id="file-upload"
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        hidden
        aria-label={t("upload_images")}
        ref={fileInputRef}
      />
      <div style={{ position: "relative" }}>
        {urls?.length > 0 ? (
          <>
            <Button type="button" onClick={handleButtonClick} className="mb-2">
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
              {t("add")}
            </Button>
            {urls?.length > 1 && (
              <Button
                type="button"
                style={{
                  backgroundColor: COLOR_APP_CANCEL,
                  color: "#ffff",
                }}
                onClick={handleRemoveImageAll}
                className="mb-2 ml-2"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: "8px" }}
                />
                {t("delete_image_slide")}
              </Button>
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleButtonClick}
              // htmlFor="file-upload"
              style={{
                backgroundColor: "#E4E4E4E4",
                height: 160,
                width: 160,
                borderRadius: "10%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {
                <div
                  style={{
                    display: "flex",
                    height: 160,
                    width: 160,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{
                      marginRight: "8px",
                      color: "#fff",
                      fontSize: 80,
                      fontWeight: "bold",
                    }}
                  />
                </div>
              }
            </button>
          </div>
        )}
        <div className="grid grid-cols-3">
          {urls.map((url, index) => (
            <div key={url} className="relative m-[5px] flex">
              {/* biome-ignore lint/a11y/useAltText: <explanation> */}
              <img
                src={url}
                alt={alt}
                className="rounded-md h-[160px] w-[160px] object-cover"
                {...other}
              />
              <div
                className="absolute top-0 right-0 bg-red-500 text-white rounded-lg w-[20px] h-[20px] flex justify-center items-center cursor-pointer"
                onClick={() => handleRemoveImage(index)}
                onKeyUp={(e) => e.key === "Enter" && handleRemoveImage(index)}
                onKeyDown={(e) => e.key === "Enter" && handleRemoveImage(index)}
                aria-label={t("delete_image")}
              >
                ×
              </div>
            </div>
          ))}
        </div>
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
