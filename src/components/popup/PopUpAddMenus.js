import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { COLOR_APP } from "../../constants";
import { master_menu_api_dev } from "../../constants/api";
import { Checkbox, FormControlLabel } from "@material-ui/core";

export default function PopUpAddMenus({
  open,
  text,
  onClose,
  onSubmit,
  categoriesRestaurant,
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [menuWithRestaurant, setMenuWithRestaurant] = useState("");
  const [menuRestaurantType, setMenuRestaurantType] = useState([]);
  useEffect(() => {
    getCategory(menuWithRestaurant);
  }, [menuWithRestaurant]);

  const getCategory = async (id) => {
    try {
      await fetch(master_menu_api_dev + `/api/menus/res-category/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) =>
          setMenuRestaurantType(
            json?.map((item) => {
              return { ...item, isChecked: true };
            })
          )
        );
    } catch (err) {
      console.log(err);
    }
  };
  const handleCheckbox = (value) => {
    console.log("value: ", value);
  };
  return (
    <div>
      <Modal show={open} size="xl">
        <Modal.Header>
          <div style={{ fontSize: "20px", fontWeight: 600 }}>
            ເພີ່ມເມນູຈຳນວນຫຼາຍ
          </div>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="12">
              <div style={{ marginBottom: 10 }}>
                <label>ເລືອກປະເພດຮ້ານ</label>
                <select
                  className="form-control"
                  onChange={(e) => setMenuWithRestaurant(e.target.value)}
                >
                  <option value="All">ທັງໝົດ</option>
                  {categoriesRestaurant?.map((item, index) => {
                    return (
                      <option key={index} value={item?._id}>
                        {" "}
                        {item?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Col>
            <Col md="12">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="checkedC"
                            //   onChange={(e) => checkAllOrders(e)}
                            style={{ marginLeft: 10 }}
                          />
                        }
                      />
                    </th>
                    <th scope="col">ຮູບພາບ</th>
                    <th scope="col">ຊື່ອາຫານ</th>
                    <th scope="col">ຊື່ອາຫານອັງກິດ</th>
                    <th scope="col">ຊື່ອາຫານຈີນ</th>
                    <th scope="col">ຊື່ອາຫານເກົ່າຫຼີ</th>
                  </tr>
                </thead>
                <tbody>
                  {menuRestaurantType.length > 0
                    ? menuRestaurantType?.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td>
                              <Checkbox
                                checked={item?.isChecked ? true : false}
                                onChange={(e) => handleCheckbox(item)}
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            </td>
                            <td>{item?.image}</td>
                            <td>{item?.name}</td>
                            <td>{item?.name_en}</td>
                            <td>{item?.name_ch}</td>
                            <td>{item?.name_kr}</td>
                          </tr>
                        );
                      })
                    : ""}
                </tbody>
              </table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={buttonDisabled}
            variant="secondary"
            onClick={onClose}
          >
            ຍົກເລີກ
          </Button>
          <Button
            disabled={buttonDisabled}
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => {
              setButtonDisabled(true);
              onSubmit().then(() => setButtonDisabled(false));
            }}
          >
            ຢືນຢັນສ້າງເມນູ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
