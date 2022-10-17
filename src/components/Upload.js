import React, { useState } from "react";
import axios from "axios";
import { PRESIGNED_URL } from "../constants/api";
import { COLOR_APP, URL_PHOTO_AW3 } from "../constants";
import { Clear } from "@material-ui/icons";

export default function Upload({
  src,
  isInvalid,
  onChange,
  alt = "",
  removeImage,
  ...other
}) {
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
          console.log("percentCompleted", percentCompleted);
          if (percentCompleted == 100)
            setTimeout(() => setImageLoading(""), 2000);
        },
      });
      const url = afterUpload.config.url.split("?")[0];
      setUrl(url);
      const splitName = url.split("/");
      const name = splitName[splitName.length - 1];
      console.log({ url, name });
      onChange({ url, name });
      setSelectImage();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="col-sm-12 center" style={{ textAlign: "center" }}>
      <input
        type="file"
        id="file-upload"
        value={selectImage}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/jpg"
        hidden
      />
      <label for="file-upload" style={{ position: "relative" }}>
        {removeImage ? (
          <div
            style={{
              backgroundColor: "red",
              padding: 5,
              position: "absolute",
              top: "-10px",
              right: "-10px",
              borderRadius: "50%",
              color: "white",
              cursor: "pointer",
            }}
            onClick={removeImage}
          >
            <Clear />
          </div>
        ) : (
          ""
        )}
        <div
          style={{
            backgroundColor: "#E4E4E4E4",
            height: 200,
            width: 200,
            borderRadius: "10%",
            cursor: "pointer",
            display: "flex",
          }}
        >
          {src ? (
            <img
              src={url}
              alt={alt}
              style={{
                borderRadius: "10%",
                height: 200,
                width: 200,
                objectFit: "cover",
              }}
              {...other}
            />
          ) : (
            <div
              style={{
                display: "flex",
                height: 200,
                width: 200,
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
        </div>
      </label>
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
