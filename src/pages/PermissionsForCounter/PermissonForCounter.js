import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import Switch from "react-switch";
import { useStore } from "../../store";
import { 
  fetchPermissionsCounter, 
  createPermissionsCounter, 
  updatePermissionsCounter 
} from "../../services/fetchPermissionsCounter";

export default function PermissionsForCounters() {
  const { t } = useTranslation();
  const { storeDetail } = useStore();
  const storeId = storeDetail?._id;
  const dayLabels = [7, 5, 3, 2];
  const [switchStates, setSwitchStates] = useState([false, false, false, false]);
  const [selectedValues, setSelectedValues] = useState(null);
  const [hasExistingPermission, setHasExistingPermission] = useState(false);

  useEffect(() => {
    const fetchInitialSwitchState = async () => {
      try {
        const data = await fetchPermissionsCounter(storeId);
        if (data) {
          setHasExistingPermission(true);
          const currentCounter = data.permissionsCounter;
          const initialStates = dayLabels.map(label => label === currentCounter);
          console.log("selectedValues: ", selectedValues)

          setSwitchStates(initialStates);
          if (currentCounter) {
            setSelectedValues(currentCounter);
          }
        }
      } catch (error) {
        console.error('Error fetching initial switch state:', error);
      }
    };

    if (storeId) {
      fetchInitialSwitchState();
    }
  }, [storeId, selectedValues]);

  const toggleSwitch = async (index) => {
    const newStates = [...switchStates];
    
    if (newStates[index]) {
      newStates[index] = false;
      setSelectedValues([]);
      
      if (hasExistingPermission) {
        try {
          await updatePermissionsCounter(storeId, 0);
        } catch (error) {
          console.error('Error updating permission counter:', error);
        }
      }
    } else {
      newStates.fill(false);
      newStates[index] = true;
      setSelectedValues([dayLabels[index]]);

      try {
        if (!hasExistingPermission) {
          await createPermissionsCounter(storeId, dayLabels[index]);
          setHasExistingPermission(true);
        } else {
          await updatePermissionsCounter(storeId, dayLabels[index]);
        }
      } catch (error) {
        console.error('Error handling permission counter:', error);
      }
    }

    setSwitchStates(newStates);
  };

  return (
    <Box sx={{ padding: { md: 20, xs: 10 } }}>
      <Breadcrumb>
        <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
        <Breadcrumb.Item active>ກຳນົດສິດໄຫ້ເຄົ້າເຕີ</Breadcrumb.Item>
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
                <BsCurrencyExchange /> {"ກຳນົດສິດ"}
              </span>
            </Card.Header>
            <Card.Body style={{ overflowX: "auto" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textWrap: "nowrap" }}>{"ຈຳນວນມື້"}</th>
                  </tr>
                </thead>
                <tbody>
                  {dayLabels.map((label, index) => (
                    <tr key={index}>
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{label} day</td>
                      <td className="text-left">
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