import React from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function LoadingAppzap() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Spinner variant="danger" animation="border" />
      <p>{t("loading")}</p>
    </div>
  );
}
