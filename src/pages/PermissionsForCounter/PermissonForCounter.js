import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import Switch from "react-switch";
//import { useStore } from "../../store";

export default function PermissionsForCounters() {
  const { t } = useTranslation();

  // ข้อมูลสำหรับแต่ละแถว
  const dayLabels = [7, 5, 3, 1];

  // สถานะสำหรับสวิตช์ทั้งหมด (เปิดได้ทีละอัน)
  const [switchStates, setSwitchStates] = useState([false, false, false, false]);
  const [selectedValues, setSelectedValues] = useState([]); // สถานะเก็บค่า value ของแถวที่เปิด
  //const {profile } = useStore();



  useEffect(() => {
    console.log(`${selectedValues} day`);
    //console.log(profile.data?.role)
  }, [selectedValues]);

  // ฟังก์ชันสำหรับการ toggle สวิตช์ โดยให้เปิดได้ทีละอันเท่านั้น
  const toggleSwitch = (index) => {
    const newStates = [...switchStates];

    // ตรวจสอบว่าต้องการปิดหรือเปิดสวิตช์
    if (newStates[index]) {
      // ถ้าสวิตช์ถูกเปิดอยู่ ให้ปิด
      newStates[index] = false;
      setSelectedValues([]); // รีเซ็ตค่า selectedValues
    } else {
      // ถ้าสวิตช์ถูกปิด ให้เปิดเฉพาะอันที่เลือกและปิดอันอื่น
      newStates.fill(false); // ปิดสวิตช์ทั้งหมด
      newStates[index] = true; // เปิดเฉพาะอันที่เลือก
      setSelectedValues([dayLabels[index]]); // อัปเดต selectedValues
    }

    setSwitchStates(newStates);
  };

  return (
    <>
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
                            onChange={() => toggleSwitch(index)} // ให้เปิดแค่สวิตช์เดียวและสามารถปิดได้
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
    </>
  );
}
