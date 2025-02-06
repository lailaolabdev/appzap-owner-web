import React, { useState } from "react";
import axios from "axios";
import { PRESIGNED_URL } from "../constants/api";
import { COLOR_APP, URL_PHOTO_AW3 } from "../constants";
import { useTranslation } from "react-i18next";

export default function Upload({
  src,
  isInvalid,
  onChange,
  alt = "",
  removeImage,
  ...other
}) {
  const { t } = useTranslation();
  const [selectImage, setSelectImage] = useState();
  const [imageLoading, setImageLoading] = useState("");
  const [url, setUrl] = useState(URL_PHOTO_AW3 + src);
  const handleUpload = async (event) => {
    setSelectImage(event.target.value);
    setImageLoading("");
    try {
      let fileData = event.target.files[0];
      const responseUrl = await axios({
        method: "post",
        url: PRESIGNED_URL,
        data: {
          name: event.target.files[0].type,
        },
      });
      //   setNamePhoto(responseUrl.data);
      let afterUpload = await axios({
        method: "put",
        url: responseUrl.data.url,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImageLoading(percentCompleted);
          if (percentCompleted === 100)
            setTimeout(() => setImageLoading(""), 2000);
        },
      });
      const url = afterUpload.config.url.split("?")[0];
      console.log("url", url);
      setUrl(url);
      const splitName = url.split("/");
      console.log("splitName", splitName);
      const name = splitName[splitName.length - 1];
      console.log("name", name);
      onChange({ url, name });
      setSelectImage();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input
        type="file"
        id="file-upload"
        value={selectImage}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/jpg"
        hidden
      />
      <div style={{ position: "relative" }}>
        {removeImage ? (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: "50%",
              transform: "translateX(50%)",
              backgroundColor: "orange",
              width: 100,
              borderRadius: "20px 20px 0 0",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={removeImage}
          >
            {t("delete_image")}
          </div>
        ) : (
          ""
        )}
        <label
          for="file-upload"
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
          {src ? (
            <img
              src={url}
              alt={alt}
              style={{
                borderRadius: "10%",
                height: 160,
                width: 160,
                objectFit: "cover",
              }}
              {...other}
            />
          ) : (
            <div
              style={{
                display: "flex",
                height: 160,
                width: 160,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  color: "#fff",
                  fontSize: 80,
                  fontWeight: "bold",
                }}
              >
                +
              </p>
            </div>
          )}
        </label>
      </div>
      {/* progass */}
      {imageLoading ? (
        <div className="progress" style={{ height: 20 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${imageLoading}%`,
              backgroundColor: COLOR_APP,
            }}
            aria-valuenow={imageLoading}
            aria-valuemin="0"
            aria-valuemax="100"
            tabIndex="0"
          >
            {imageLoading}%
          </div>
        </div>
      ) : (
        <div style={{ height: 20 }} />
      )}
    </div>
  );
}
