import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Button, InputGroup, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { errorAdd, successAdd } from "../../helpers/sweetalert";

export default function CreateMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();

  // console.log("state: ", state);
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState();

  console.log(" State ", state?.key);

  // function
  const createMember = async () => {
    try {
      if (disabledButton) return;
      setDisabledButton(true);
      const { TOKEN } = await getLocalData();
      const _data = await addMember(formData, TOKEN);
      if (_data.error) throw new Error("can not create member");
      successAdd("ເພີ່ມສະມາຊີກສຳເລັດ");
      if (state?.key) {
        navigate("/debt/create");
      } else {
        navigate("/reports/members-report");
      }
    } catch (err) {
      errorAdd(`${t("add_fail")}`);
      setDisabledButton(false);
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("add_member")}</Breadcrumb.Item>
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
            {t("add_member_form")}
          </Card.Header>
          <Card.Body>
            <div>
              <div className="mb-3">
                <Form.Label>{t("member_name")}</Form.Label>
                <Form.Control
                  placeholder={t("member_name")}
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
                <Form.Label>{t("tel")}</Form.Label>
                <InputGroup>
                  <InputGroup.Text id="phone-addon1">020</InputGroup.Text>
                  <Form.Control
                    placeholder="XXXX-XXXX"
                    aria-describedby="phone-addon1"
                    maxLength={8}
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
                <Form.Label>{t("birth_date")}</Form.Label>
                <DateTimeComponent
                  value={formData?.birthday}
                  onChange={t(birth_date) => {
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
                  {t("add")}
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
