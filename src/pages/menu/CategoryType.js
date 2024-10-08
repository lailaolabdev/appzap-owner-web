import { React, useState, useEffect } from "react";
import Box from "../../components/Box";
import axios from "axios";
import { BODY, COLOR_APP } from "../../constants";
import { Breadcrumb, Nav, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT_SEVER_TABLE_MENU, getLocalData } from "../../constants/api";
import PopUpAddCategoryType from "../../components/popup/PopUpAddCategoryType";
import { getCategoryType } from "../../services/menu";

export default function CategoryType() {
  const { t } = useTranslation();
  const [popup, setPopup] = useState();
  const [storeId, setStoreId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [categoryTypes, setCategoryTypes] = useState([]);
  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _menuOptionList = () => {
    navigate(`/settingStore/menu-option/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };
  const _categoryType = () => {
    navigate(`/settingStore/menu/category-type`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setStoreId(_localData.DATA.storeId);
        fetchCategoryTypes(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const fetchCategoryTypes = async (storeId) => {
    setIsLoading(true);
    const data = await getCategoryType(storeId);
    console.log("-----", data);
    setCategoryTypes(data);
    setIsLoading(false);
  };

  const createCategoryType = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(`${END_POINT_SEVER_TABLE_MENU}/v3/categoroy-type`, values);
      const _localData = await getLocalData();
      fetchCategoryTypes(_localData?.DATA?.storeId);
    } catch (error) {
      console.error("Error creating category type:", error);
    } finally {
      setIsLoading(false);
    }
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
              eventKey="/settingStore/menu-option"
              onClick={() => _menuOptionList()}
            >
              {t("option_menu")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category"
              onClick={() => _category()}
            >
              {t("food_type")}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category-type"
              onClick={() => _categoryType()}
            >
              {t("category_type")}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="col-sm-12 text-right">
          <Button
            className="col-sm-2"
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => setPopup({ popUpAddCategoryType: true })}
          >
            {t("create_category")}
          </Button>{" "}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">{t("no")}</th>
                  <th scope="col">{t("food_category")}</th>
                </tr>
              </thead>
              <tbody>
                {categoryTypes.map((categoryType, index) => (
                  <tr key={categoryType.id}>
                    <td>{index + 1}</td>
                    <td>{categoryType.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>
      <PopUpAddCategoryType
        open={popup?.popUpAddCategoryType}
        onClose={() => setPopup()}
        onSubmit={createCategoryType}
        storeId={storeId}
      />
    </div>
  );
}
