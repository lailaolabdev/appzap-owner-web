import { React, useState, useEffect } from "react";
import Box from "../../components/Box";
import axios from "axios";
import { BODY, COLOR_APP } from "../../constants";
import { Breadcrumb, Nav, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import PopUpAddCategoryType from "../../components/popup/PopUpAddCategoryType";

export default function CategoryType() {
  const { t } = useTranslation();
  const [popup, setPopup] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [categoryTypes, setCategoryTypes] = useState([]);
  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
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
        fetchCategoryTypes(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const fetchCategoryTypes = async () => {
    setIsLoading(true);
    const _resCategory = await axios({
      method: "get",
      url: END_POINT_SEVER + `/v3/categoroy-type`,
    });
    console.log("-----", _resCategory?.data.data);
    setCategoryTypes(_resCategory?.data.data);
    setIsLoading(false);
  };

  const createCategoryType = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(`${END_POINT_SEVER}/v3/categoroy-type`, values);
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
                  <th scope="col">ຊື່ໝວດອາຫານ</th>
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
      />
    </div>
  );
}
