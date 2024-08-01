import { React, useState } from "react";
import Box from "../../components/Box";
import { BODY } from "../../constants";
import { Breadcrumb, Nav, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PopUpAddCategoryType from "../../components/popup/PopUpAddCategoryType";

export default function CategoryType() {
  const { t } = useTranslation();
  const [popup, setPopup] = useState();
  const navigate = useNavigate();
  const params = useParams();
  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };
  const _categoryType = () => {
    navigate(`/settingStore/menu/category-type`);
  };

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("restaurant_setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("menu")}</Breadcrumb.Item>
        </Breadcrumb>
        <Nav variant="tabs" defaultActiveKey="/settingStore/category-type">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>
              {t("menu")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category"
              onClick={() => _category()}
            >
              {t("foodType")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category-type"
              onClick={() => _categoryType()}
            >
              {t("categoryType")}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div style={{ marginTop: 20 }}>
          <Button onClick={() => setPopup({ popUpAddCategoryType: true })}>
            ສ້າງໝວດໝູ່
          </Button>
        </div>
      </Box>
      <PopUpAddCategoryType
        open={popup?.popUpAddCategoryType}
        onClose={() => setPopup()}
      />
    </div>
  );
}
