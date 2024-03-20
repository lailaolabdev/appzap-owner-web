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

export default function SettingMemberPointPage() {
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
          <Breadcrumb.Item active>ຕັ້ງຄ່າການໃຫ້ຄະແນນ</Breadcrumb.Item>
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
            ຟອມຕັ້ງຄ່າການໃຫ້ຄະແນນ
          </Card.Header>
          <Card.Body>
            <div>
              <div
               className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  width: "100%",
                }}
              >
                <div>
                  <Form.Label>ຈຳນວນເງິນລວມຂອງບິນ</Form.Label>
                  <Form.Control value={1} disabled />
                </div>
                <div>
                  <Form.Label>ຈຳນວນຄະແນນທທີ່ຈະໄດ້</Form.Label>
                  <Form.Control value={1} disabled />
                </div>
              </div>
              <div className="mb-3">
               <p>ປະຈຸບັນຍັງບໍ່ສາມາດແກ້ໄຂຄະແນນໄດ້ຖ້າຕ້ອງການແກ້ໄຂກະລຸນາແຈ້ງທີມງານຊັບພອດຂອງ AppZap</p>
              </div>
              
            </div>
          </Card.Body>
        </Card>
      </div>
      {/* popup */}
    </>
  );
}
