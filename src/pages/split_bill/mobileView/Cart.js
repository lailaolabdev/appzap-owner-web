import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getHeaders } from "../../../services/auth";
import {
  END_POINT_SEVER,
} from "../../../constants/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [selectedMenu, setSelectedMenu] = useState([]);

  useEffect(() => {
    if (location?.state?.length > 0) setSelectedMenu(location?.state);
  }, [location?.state]);

  const onRemoveFromCart = (id) => {
    let selectedMenuCopied = [...selectedMenu];
    for (let i = 0; i < selectedMenuCopied.length; i++) {
      var obj = selectedMenuCopied[i];
      if (obj.id === id) {
        selectedMenuCopied.splice(i, 1);
      }
    }
    setSelectedMenu([...selectedMenuCopied]);
  };

  const createOrder = async (data, header, isPrinted) => {
    console.log("createOrder: /v3/public/bill/create")
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      axios
        .post(
          END_POINT_SEVER + "/v3/public/bill/create",
          {
            orders: data,
            storeId: params?.storeId,
            tableId: params?.tableId,
          },
          {
            headers: headers,
          }
        )
        .then(async (response) => {
          if (response?.data) {
            await Swal.fire({
              icon: "success",
              title: "ເພີ່ມອໍເດີສໍາເລັດ",
              showConfirmButton: false,
              timer: 1800,
            });
            if (isPrinted) {
              await document.getElementById("btnPrint").click();
            }
            navigate.goBack();
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "warning",
            title: "ອາຫານບໍ່ພຽງພໍ",
            showConfirmButton: false,
            timer: 1800,
          });
        });
    } catch (error) {
      console.log("BBB===>", error);
    }
  };

  const onSubmit = async (isPrinted) => {
    if (selectedMenu.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "ເລືອກເມນູອໍເດີກ່ອນກົດສັ່ງອາຫານ",
        showConfirmButton: false,
        timer: 1800,
      });
      return;
    }
    let header = await getHeaders();
    if (selectedMenu.length !== 0) {
      await createOrder(selectedMenu, header, isPrinted);
    }
  };
  return (
    <div>
      <div style={{ padding: 10 }}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ color: "#FB6E3B", fontSize: 30 }}
          // onClick={() => navigate(selectedMenu)}
          onClick={() =>
            navigate.replace(
              "/menus/" + params?.storeId + "/" + params?.tableId,
              selectedMenu
            )
          }
        />
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          fontWeight: "bold",
        }}
      >
        <p>ລາຍການອາຫານ</p>
      </div>
      <div>
        <Table responsive className="table">
          <thead style={{ backgroundColor: "#F1F1F1" }}>
            <tr style={{ fontSize: "bold", border: "none" }}>
              <th style={{ border: "none" }}>ລຳດັບ</th>
              <th style={{ border: "none" }}>ຊື່ເມນູ</th>
              <th style={{ border: "none" }}>ຈຳນວນ</th>
              <th style={{ border: "none" }}>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {selectedMenu &&
              selectedMenu.map((data, index) => {
                return (
                  <tr key={"selectMenu" + index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.quantity}</td>
                    <td>
                      <i
                        onClick={() => onRemoveFromCart(data.id)}
                        className="fa fa-trash"
                        aria-hidden="true"
                        style={{ color: "#FB6E3B", cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <div
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          right: 30,
          width: "300px",
          padding: 25,
        }}
      >
        <button
          style={{
            margin: "auto",
            backgroundColor: "#FB6E3B",
            width: 150,
            height: 40,
            borderRadius: 8,
            border: "solid 2px #FB6E3B",
            color: "#FFFFFF",
          }}
          onClick={() => {
            console.log("Herere");
            onSubmit(false);
           
          }
          }
        >
          ສັ່ງອາຫານ
        </button>
      </div>
    </div>
  );
}

export default Cart;
