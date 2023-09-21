import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";

// Add all Font Awesome icons to the library
// library.add(icons);
export default function PopUpIconsFontawesome({
  tableName,
  open,
  onClose,
  onSubmit,
}) {
  const iconNames = Object.keys();
  return (
    <Modal show={open} onHide={onClose} size="lg">
      <Modal.Header closeButton>Fontawesome</Modal.Header>
      <Modal.Body>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            }}
          >
            {iconNames.map((iconName, index) => (
              <div key={index}>
                <FontAwesomeIcon icon={icons[iconName]} />
                {/* <div>{iconName}</div> */}
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
