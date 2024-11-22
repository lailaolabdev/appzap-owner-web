import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function PermissionsUserList() {
  const { t } = useTranslation();
  const [switchStates, setSwitchStates] = useState([
    false,
    false,
    false,
    false,
  ]);
  const data = [
    { label: "ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ" },

  ];

  const toggleSwitch = (index) => {
    const newStates = [...switchStates];
    newStates[index] = !newStates[index];
    setSwitchStates(newStates);
  };

  return (
    <Box sx={{ padding: { md: 20, xs: 10 } }}>
      <Breadcrumb>
        <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
        <Breadcrumb.Item>{t("ລາຍການພະນັກງານ")}</Breadcrumb.Item>
        <Breadcrumb.Item active>manage-user</Breadcrumb.Item>
      </Breadcrumb>

      <Tabs defaultActiveKey="currency-list">
        <Tab eventKey="currency-list" style={{ paddingTop: 20 }}>
          <Card border="primary" style={{ margin: 0 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <span>
                <BsCurrencyExchange /> {"ຈັດການ-user"}
              </span>
            </Card.Header>
            <Card.Body style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ whiteSpace: "nowrap" }}>{"ຈັດການ"}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((e, index) => (
                    <tr key={index}>
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{e.label} </td>
                      <td
                        className="text-left"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <div
                          style={{
                            width: 30, // กำหนดความกว้างคงที่
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {switchStates[index] && (
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP, cursor: "pointer" }}
                            />
                          )}
                        </div>
                        <Switch
                          checked={switchStates[index]}
                          onChange={() => toggleSwitch(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Box>
  );
}
