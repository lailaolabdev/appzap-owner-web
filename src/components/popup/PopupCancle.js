// import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
// import Upload from "../Upload";
import { COLOR_APP_CANCEL, COLOR_APP } from "../../constants";


export default function PopUpStoreEdit({ open, onClose, onSubmit, data }) {
    return (
      <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>ເຫດຜົນຍົກເລີກສິນຄ້າ</Modal.Title>
        </Modal.Header>
          <Formik>
          {({
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="cencel" style={{  }}>
                <button>ເສີບຜິດໂຕະ</button>
                <button>ລູກຄ້າຍົກເລີກ</button>
                <button>ຄົວເຮັດອາຫານຜິດ</button>
                <button>ພະນັກງານເສີບ ຄີອາຫານຜິດ</button>
                <button>ອາຫານດົນ</button>
                <button>ອາຫານໝົດໂຕະ</button>
                <button>ອາຫານໝົດ</button>
                <button>ເຄື່ອງດື່ນໝົດ</button>
                <button>ບໍ່ມີອາຫານໃນໂຕະ</button>
                </div>
              </Modal.Body>
            </form>
          )}
        </Formik>
      </Modal>
    );
  }