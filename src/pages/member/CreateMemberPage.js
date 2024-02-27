import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button, InputGroup, Form } from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle,
} from "react-icons/bs";
import { MdAssignmentAdd, MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import { useStore } from "../../store";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { FaSearch } from "react-icons/fa";
import {
  addMember,
  getMemberCount,
  getMembers,
} from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import DateTimeComponent from "../../components/DateTimeComponent";

export default function CreateMemberPage() {
  const navigate = useNavigate();
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState();

  // provider

  // useEffect

  // function
  const createMember = async () => {
    try {
      if (disabledButton) return;
      setDisabledButton(true);
      const { TOKEN } = await getLocalData();
      const _data = await addMember(formData, TOKEN);
      if (_data.error) throw new Error("can not create member");
      navigate("/report/members-report");
    } catch (err) {
      setDisabledButton(true);
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>ລາຍງານ</Breadcrumb.Item>
          <Breadcrumb.Item active>ເພີ່ມລາຍການສະມາຊິກ</Breadcrumb.Item>
        </Breadcrumb>

        <Card border="primary" style={{ maxWidth: 500 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            ຟອມເພີ່ມສະມາຊິກ
          </Card.Header>
          <Card.Body>
            <div>
              <div className="mb-3">
                <Form.Label>ຊື່ສະມາຊິກ</Form.Label>
                <Form.Control
                  placeholder="ຊື່ສະມາຊິກ"
                  value={formData?.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="mb-3">
                <Form.Label>ເບີໂທ</Form.Label>
                <InputGroup>
                  <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
                  <Form.Control
                    placeholder="XXXX-XXXX"
                    aria-describedby="phone-addon1"
                    value={formData?.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    }}
                  />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Form.Label>ວັນ/ເດືອນ/ປີ ເກີດ</Form.Label>
                <DateTimeComponent
                  value={formData?.birthday}
                  onChange={(birthday) => {
                    setFormData((prev) => ({
                      ...prev,
                      birthday: birthday,
                    }));
                  }}
                />
              </div>
              <div>
                <Button
                  style={{ width: "100%" }}
                  disabled={disabledButton}
                  onClick={createMember}
                >
                  ເພີ່ມ
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      {/* popup */}
     
    </>
  );
}
