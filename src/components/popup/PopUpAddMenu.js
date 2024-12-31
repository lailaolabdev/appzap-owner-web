import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { COLOR_APP } from "../../constants";
import { IoMdCloseCircle } from "react-icons/io";
import Box from "../../components/Box";
import Upload from "../Upload";
import { moneyCurrency } from "../../helpers";

import { useStoreStore } from "../../zustand/storeStore";

export default function PopUpAddMenu({ open, onClose, onSubmit }) {
  // state
  const [isStockOne, setIsStockOne] = useState(false);
  const [isStockMulti, setIsStockMulti] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [option, setOption] = useState([]);
  const [addStock, setAddStock] = useState(false);
  const [addOption, setAddOption] = useState(false);

  const [nameOption, setNameOption] = useState();
  const [priceOption, setPriceOption] = useState();

  const { storeDetail } = useStoreStore()

  return (
    <Modal show={open} onHide={onClose} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>ເພີ່ມເມນູອາຫານ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          name: "",
          name_en: "",
          name_cn: "",
          name_kr: "",
          quantity: 1,
          categoryId: "",
          price: "",
          detail: "",
          images: [],
          unit: "",
          menuOptionId: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
          }
          if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
            errors.price = "ກະລຸນາປ້ອນລາຄາ...";
          }
          if (!values.categoryId) {
            errors.categoryId = "ກະລຸນາປ້ອນ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values).then((e) => {});
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <Box sx={{ display: { md: "flex", xs: "default" }, gap: 10 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Upload
                    src={values?.images?.[0] || ""}
                    removeImage={() => setFieldValue("images", [])}
                    onChange={(e) => {
                      setFieldValue("images", [e.name]);
                    }}
                  />
                </Box>
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      gridGap: 10,
                    }}
                  >
                    <Form.Group>
                      <Form.Label>
                        ຊື່ອາຫານ <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        placeholder="ຊື່ອາຫານ..."
                        style={{
                          border:
                            errors.name && touched.name && errors.name
                              ? "solid 1px red"
                              : "",
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name_en"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name_en}
                        placeholder="ຊື່ອາຫານ..."
                        style={{
                          border:
                            errors.name_en && touched.name_en && errors.name_en
                              ? "solid 1px red"
                              : "",
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ຊື່ອາຫານ (cn)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name_cn"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name_cn}
                        placeholder="ຊື່ອາຫານ..."
                        style={{
                          border:
                            errors.name_cn && touched.name_cn && errors.name_cn
                              ? "solid 1px red"
                              : "",
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>ຊື່ອາຫານ (kr)</Form.Label>
                      <Form.Control
                        type="text"
                        name="name_kr"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name_kr}
                        placeholder="ຊື່ອາຫານ..."
                        style={{
                          border:
                            errors.name_kr && touched.name_kr && errors.name_kr
                              ? "solid 1px red"
                              : "",
                        }}
                      />
                    </Form.Group>
                  </div>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>
                      ປະເພດອາຫານ <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="categoryId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.categoryId}
                      style={{
                        border:
                          errors.categoryId &&
                          touched.categoryId &&
                          errors.categoryId
                            ? "solid 1px red"
                            : "",
                      }}
                    >
                      <option selected={true} disabled={true} value="">
                        ເລືອກປະເພດອາຫານ
                      </option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Box>
              <Form.Group>
                <Form.Label>
                  ລາຄາ <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  placeholder="ລາຄາ..."
                  style={{
                    border:
                      errors.price && touched.price && errors.price
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>
              <Form.Group style={{ display: "flex" }}>
                <Form.Check
                  id="isOption"
                  checked={isOption}
                  onChange={() => {
                    setIsOption((prev) => !prev);
                    setIsStockMulti(false);
                    setIsStockOne(false);
                  }}
                />
                <Form.Label htmlFor="isOption">ເພີ່ມ Option</Form.Label>
              </Form.Group>
              {isOption && !isStockMulti && !isStockOne && (
                <div
                  style={{
                    border: "1px dotted #ccc",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  {!addOption && (
                    <Button
                      onClick={() => setAddOption(true)}
                      style={{ marginBottom: 10 }}
                    >
                      ເພີ່ມວັດຖຸດິບ
                    </Button>
                  )}
                  {addOption && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 60px",
                        gridGap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Form.Control
                        type="text"
                        value={nameOption}
                        onChange={(e) => setNameOption(e.target.value)}
                        placeholder="ຊື່ Option"
                      />
                      <Form.Control
                        type="number"
                        value={priceOption}
                        onChange={(e) => setPriceOption(e.target.value)}
                        placeholder={`ລາຄາ (${storeDetail?.firstCurrency})`}
                      />
                      <Button
                        onClick={() =>
                          setOption((prev) => [
                            ...prev,
                            { nameOption, priceOption },
                          ])
                        }
                      >
                        ເພີ່ມ
                      </Button>
                    </div>
                  )}
                  <div
                    style={{
                      border: "1px dotted #ccc",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    {option?.map((e, i) => (
                      <li key={i}>
                        <span style={{ fontWeight: "bold" }}>
                          {e?.nameOption}
                        </span>{" "}
                        <span style={{ color: "#ccc" }}>
                          ລາຄາ (
                          <span style={{ color: "#000", fontWeight: "bold" }}>
                            {moneyCurrency(e?.priceOption)}{" "}
                            {storeDetail?.firstCurrency}
                          </span>
                          )-
                        </span>
                        <span
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() =>
                            setOption((prev) => [
                              ...prev.filter((e, index) => i !== index),
                            ])
                          }
                        >
                          <IoMdCloseCircle />
                        </span>
                      </li>
                    ))}
                  </div>
                </div>
              )}
              <hr />
              <div style={{ display: "flex", gap: 10 }}>
                <Form.Group style={{ display: "flex" }}>
                  <Form.Check
                    id="isStockOne"
                    checked={isStockOne}
                    onChange={() => {
                      setIsStockOne((prev) => !prev);
                      setIsStockMulti(false);
                      setIsOption(false);
                    }}
                  />
                  <Form.Label htmlFor="isStockOne">ສະຕ໊ອກເປັນອັນ</Form.Label>
                </Form.Group>
                <Form.Group style={{ display: "flex" }}>
                  <Form.Check
                    id="isStockMulti"
                    checked={isStockMulti}
                    onChange={() => {
                      setIsStockMulti((prev) => !prev);
                      setIsStockOne(false);
                      setIsOption(false);
                    }}
                  />
                  <Form.Label htmlFor="isStockMulti">ສະຕ໊ອກວັດຖຸດິບ</Form.Label>
                </Form.Group>
              </div>
              {isStockMulti && !isOption && (
                <div
                  style={{
                    border: "1px dotted #ccc",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  {!addStock && (
                    <Button
                      onClick={() => setAddStock(true)}
                      style={{ marginBottom: 10 }}
                    >
                      ເພີ່ມວັດຖຸດິບ
                    </Button>
                  )}
                  {addStock && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 60px",
                        gridGap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="ຊື່ວັດຖຸດິບ"
                        style={{
                          border:
                            errors.price && touched.price && errors.price
                              ? "solid 1px red"
                              : "",
                        }}
                      />

                      <Form.Control
                        type="number"
                        name="number"
                        placeholder="ຈຳນວນ (Gram)"
                        style={{
                          border:
                            errors.price && touched.price && errors.price
                              ? "solid 1px red"
                              : "",
                        }}
                      />
                      <Button>ເພີ່ມ</Button>
                    </div>
                  )}
                  <div
                    style={{
                      border: "1px dotted #ccc",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <li>
                      <span style={{ fontWeight: "bold" }}>ຜັກກາດ</span>
                      {" ------- "}
                      <span style={{ color: "#ccc" }}>
                        ຈຳນວນ (
                        <span style={{ color: "#000", fontWeight: "bold" }}>
                          5 Gram
                        </span>
                        )--
                      </span>
                      <span style={{ color: "red" }}>
                        <IoMdCloseCircle />
                      </span>
                    </li>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={() => handleSubmit()}
              >
                ບັນທຶກເມນູອາຫານ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
