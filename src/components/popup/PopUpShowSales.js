import React from "react";
import { Modal, Button } from "react-bootstrap";
import { COLOR_APP } from "../../constants";

export default function PopUpShowSales({ open, onClose }) {
  const data = [
    {
      id: 1,
      title: "ສະແດງການຂາຍ",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThmIrX5ONlBkcE0k3hD5fh5NfCnsVZfDU3jA&s",
    },
  ];

  return (
    <Modal size="md" show={open} onHide={onClose} centered
    >
      {data.map((item) => (
        <div key={item.id}
        //  style={{border:'1px solid red'}} 
        >
          <Modal.Header
            closeButton
            className="d-flex justify-content-center"
            style={{
              border: "none",
            }}
          >
            <Modal.Title
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {item.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              border: "none",
              paddingBottom: 0, 
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                margin: "0 auto", 
                paddingTop: "80%", 
                borderRadius: 10,
                overflow: "hidden", 
              }}
            >
              <img
                src={item.img}
                alt=""
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", 
                }}
              />
            </div>
          </Modal.Body>
        </div>
      ))}
      <Modal.Footer
        className="d-flex justify-content-center"
        style={{
          borderTop: "none", 
        }}
      >
        <Button
          style={{
            width: "300px",
            textAlign: "center",
            backgroundColor: COLOR_APP,
            border: 0,
          }}
          onClick={onClose}
        >
          ສັ່ງຊື້
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
