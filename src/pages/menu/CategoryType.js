import { React, useState, useEffect, useMemo } from "react";
import { getHeaders } from "../../services/auth";
import { Formik } from "formik";
import Box from "../../components/Box";
import axios from "axios";
import { BODY, COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import { Button, Modal, Form, Nav, Breadcrumb, Row, Col, Card, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT_SEVER_TABLE_MENU, getLocalData } from "../../constants/api";
import PopUpAddCategoryType from "../../components/popup/PopUpAddCategoryType";
import { getCategoryType } from "../../services/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { successAdd, errorAdd } from "./../../helpers/sweetalert";
import { fontMap } from "../../utils/font-map";
import { cn } from "../../utils/cn";
import { useStore } from "../../store";
import { useCounterRoleStore } from "../../zustand/counterRole";
import { useMenuStore } from "../../zustand/menuStore";
import { moneyCurrency } from "../../helpers";

export default function CategoryType() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [popup, setPopup] = useState();
  const [storeId, setStoreId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categorysType, setCategoryType] = useState([]);
  const [getTokken, setgetTokken] = useState();
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [dateDelete, setdateDelete] = useState("");
  const [dataUpdate, setdataUpdate] = useState("");

  // Edit modal menu selection states
  const [editSelectedMenus, setEditSelectedMenus] = useState([]);
  const [editSearchTerm, setEditSearchTerm] = useState("");
  const [editSelectAll, setEditSelectAll] = useState(false);
  const [editSelectedCategoryFilter, setEditSelectedCategoryFilter] = useState("All");

  const { counterRoleEditMenu } = useCounterRoleStore();
  const { profile } = useStore();
  const { menus, menuCategories, getMenuCategories, setMenuCategories, getMenus, setMenus } = useMenuStore();

  // Safety checks for props
  const safeMenus = menus || [];
  const safeMenuCategories = menuCategories || [];

  // Filter menus for edit modal based on search term and category
  const editFilteredMenus = useMemo(() => {
    if (!safeMenus || !Array.isArray(safeMenus)) return [];
    
    let filtered = safeMenus.filter((menu) =>
      menu.name?.toLowerCase().includes(editSearchTerm.toLowerCase()) ||
      menu.name_en?.toLowerCase().includes(editSearchTerm.toLowerCase())
    );

    // Filter by category if not "All"
    if (editSelectedCategoryFilter !== "All") {
      filtered = filtered.filter((menu) => 
        menu.categoryId?._id === editSelectedCategoryFilter ||
        menu.categoryId === editSelectedCategoryFilter
      );
    }

    return filtered;
  }, [safeMenus, editSearchTerm, editSelectedCategoryFilter]);

  // Get category statistics for edit modal
  const editGetCategoryStats = useMemo(() => {
    if (!safeMenus || !Array.isArray(safeMenus) || !safeMenuCategories) return {};
    
    const stats = {};
    safeMenuCategories.forEach(category => {
      const categoryMenus = safeMenus.filter(menu => 
        menu.categoryId?._id === category._id || menu.categoryId === category._id
      );
      stats[category._id] = {
        name: category.name,
        count: categoryMenus.length,
        selected: categoryMenus.filter(menu => editSelectedMenus.includes(menu._id)).length
      };
    });
    
    return stats;
  }, [safeMenus, safeMenuCategories, editSelectedMenus]);

  // Update selectAll state based on current filter for edit modal
  useEffect(() => {
    if (editFilteredMenus.length === 0) {
      setEditSelectAll(false);
    } else {
      const allFilteredSelected = editFilteredMenus.every(menu => 
        editSelectedMenus.includes(menu._id)
      );
      setEditSelectAll(allFilteredSelected);
    }
  }, [editFilteredMenus, editSelectedMenus]);

  // Synchronize editSelectedMenus with dataUpdate when modal opens
  useEffect(() => {
    if (show2 && dataUpdate) {
      
      let existingMenuIds = [];
      
      if (dataUpdate.menuIds && Array.isArray(dataUpdate.menuIds)) {
        existingMenuIds = dataUpdate.menuIds;
      } else if (dataUpdate.menuId && Array.isArray(dataUpdate.menuId)) {
        existingMenuIds = dataUpdate.menuId;
      } else if (dataUpdate.menus && Array.isArray(dataUpdate.menus)) {
        existingMenuIds = dataUpdate.menus.map(m => m._id || m.id);
      }
      
      
      setEditSelectedMenus(existingMenuIds);
    }
  }, [show2, dataUpdate]);

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
        setgetTokken(_localData);
      }
      if (!menus.length) {
        const fetchedMenus = await getMenus(storeId);
        setMenus(fetchedMenus); // Save to zustand store
      }
      if (!menuCategories.length) {
        const fetchedCategories = await getMenuCategories(_localData.DATA.storeId);
        setMenuCategories(fetchedCategories); // Save to zustand store
      }
    };
    
    fetchData();
  }, []);

  const fetchCategoryTypes = async (storeId) => {
    setIsLoading(true);
    const data = await getCategoryType(storeId);
    console.log({ data });
    setCategoryTypes(data);
    setIsLoading(false);
  };

  const createCategoryType = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${END_POINT_SEVER_TABLE_MENU}/v3/category-type`,
        values
      );
      const _localData = await getLocalData();
      fetchCategoryTypes(_localData?.DATA?.storeId);
    } catch (error) {
      console.error("Error creating category type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShow2 = async (item) => {
     // Debug log to see the structure
    setdataUpdate(item);
    
    // Initialize selected menus with existing menuIds from the category type
    if (item.menuIds && Array.isArray(item.menuIds)) {
      console.log("Using menuIds:", item.menuIds);
      setEditSelectedMenus(item.menuIds);
    } else if (item.menuId && Array.isArray(item.menuId)) {
      console.log("Using menuId:", item.menuId);
      setEditSelectedMenus(item.menuId);
    } else if (item.menus && Array.isArray(item.menus)) {
      console.log("Using menus:", item.menus.map(m => m._id || m.id));
      setEditSelectedMenus(item.menus.map(m => m._id || m.id));
    } else {
      console.log("No menu IDs found, starting with empty selection");
      setEditSelectedMenus([]);
    }
    
    setShow2(true);
  };

  

  // Handle individual menu selection for edit modal
  const handleEditMenuSelect = (menuId) => {
    setEditSelectedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  // Handle select all functionality for edit modal
  const handleEditSelectAll = () => {
    if (editSelectAll) {
      // Deselect all filtered items
      const filteredMenuIds = editFilteredMenus.map(menu => menu._id);
      setEditSelectedMenus(prev => prev.filter(id => !filteredMenuIds.includes(id)));
    } else {
      // Select all filtered items (add them to existing selection)
      const filteredMenuIds = editFilteredMenus.map(menu => menu._id);
      setEditSelectedMenus(prev => {
        const newSelection = [...prev];
        filteredMenuIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
    // selectAll state will be updated by useEffect
  };

  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };

  const handleClose3 = () => setShow3(false);
  const handleClose2 = () => {
    // Reset edit modal states
    setEditSelectedMenus([]);
    setEditSearchTerm("");
    setEditSelectAll(false);
    setEditSelectedCategoryFilter("All");
    setShow2(false);
  };

  // const getData = async (id) => {
  //   setIsLoading(true);
  //   const _resCategory = await axios({
  //     method: "get",
  //     url: END_POINT_SEVER_TABLE_MENU + `/v3/category-type`,
  //   });
  //   console.log("-----", _resCategory?.data);
  //   setCategoryType(_resCategory?.data);
  //   setIsLoading(false);
  // };

  const _updateCategory = async (values) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/update/category-type`,
        {
          id: dataUpdate?._id,
          data: {
            name: values?.name,
            selectedMenus: editSelectedMenus, // Include selected menus
          },
        },
        {
          headers: headers,
        }
      );
      if (resData?.data) {
        setCategoryType(resData?.data);
        fetchCategoryTypes(getTokken?.DATA?.storeId);
        setShow2(false);
        successAdd(`${t("edit_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("edit_fail")}`);
    }
  };

  const _confirmeDelete = async () => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const _resData = await axios.delete(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/delete/category-type/${dateDelete?.id}`,
        {
          headers: headers,
        }
      );
      if (_resData?.data) {
        setCategoryType(_resData?.data);
        handleClose3();
        successAdd(`${t("delete_success")}`);
        fetchCategoryTypes(getTokken?.DATA?.storeId);
      }
    } catch (err) {
      errorAdd(`${t("delete_fail")}`);
    }
  };

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span className={fontMap[language]}>{t("restaurant_setting")}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className={fontMap[language]}>{t("categoryType")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Nav variant="tabs" defaultActiveKey="/settingStore/category-type">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>
              <span className={fontMap[language]}>{t("menu")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/menu-option"
              onClick={() => _menuOptionList()}
            >
              <span className={fontMap[language]}>{t("option_menu")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category"
              onClick={() => _category()}
            >
              <span className={fontMap[language]}>{t("foodType")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category-type"
              onClick={() => _categoryType()}
            >
              <span className={fontMap[language]}>{t("categoryType")}</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="col-sm-12 text-right mt-3">
          {profile?.data?.role === "APPZAP_ADMIN" ? (
            <Button
              className={cn("col-sm-2", fontMap[language])}
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => setPopup({ popUpAddCategoryType: true })}
            >
              + {t("create_category")}
            </Button>
          ) : (
            <Button
              disabled={!counterRoleEditMenu}
              className={cn("col-sm-2", fontMap[language])}
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => setPopup({ popUpAddCategoryType: true })}
            >
              + {t("create_category")}
            </Button>
          )}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("no")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("food_category")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("manage")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryTypes?.map((categoryType, index) => (
                  <tr key={categoryType?.id}>
                    <td>{index + 1}</td>
                    <td>{categoryType?.name}</td>
                    {/* manage icon */}
                    <td
                      // className="manage"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {profile?.data?.role === "APPZAP_ADMIN" ? (
                        <>
                          <button>
                            <FontAwesomeIcon
                              icon={faEdit}
                              onClick={() => handleShow2(categoryType)}
                              className=" text-orange-500 ml-[20px]"
                            />
                          </button>

                          <button>
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className=" text-red-500 ml-[20px]"
                              onClick={() =>
                                handleShow3(
                                  categoryType?._id,
                                  categoryType?.name
                                )
                              }
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`${
                              !counterRoleEditMenu ? "cursor-not-allowed" : ""
                            }`}
                            disabled={!counterRoleEditMenu}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              onClick={() => handleShow2(categoryType)}
                              className={`${
                                !counterRoleEditMenu
                                  ? "text-orange-300 ml-[20px]"
                                  : " text-orange-500 ml-[20px]"
                              }`}
                            />
                          </button>

                          <button
                            className={`${
                              !counterRoleEditMenu ? "cursor-not-allowed" : ""
                            }`}
                            disabled={!counterRoleEditMenu}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className={`${
                                !counterRoleEditMenu
                                  ? "text-red-300 ml-[20px]"
                                  : " text-red-500 ml-[20px]"
                              }`}
                              onClick={() =>
                                handleShow3(
                                  categoryType?._id,
                                  categoryType?.name
                                )
                              }
                            />
                          </button>
                        </>
                      )}
                    </td>
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
        menus={menus}
        menuCategories={menuCategories}
      />
      <Modal show={show2} onHide={handleClose2} size="lg">
        <Formik
          initialValues={{
            name: dataUpdate?.name ?? "",
            selectedMenus: (() => {
              if (dataUpdate?.menuIds && Array.isArray(dataUpdate.menuIds)) {
                return dataUpdate.menuIds;
              } else if (dataUpdate?.menuId && Array.isArray(dataUpdate.menuId)) {
                return dataUpdate.menuId;
              } else if (dataUpdate?.menus && Array.isArray(dataUpdate.menus)) {
                return dataUpdate.menus.map(m => m._id || m.id);
              }
              return [];
            })()
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("fill_type_name")}`;
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _updateCategory(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>{t("edit_category")}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {/* Category Name Section */}
                <Form.Group controlId="name" className="mb-4">
                  <Form.Label>{t("food_category")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder={`${t("food_category")}...`}
                    isInvalid={errors.name && touched.name}
                  />
                  {errors.name && touched.name && (
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Menu Selection Section */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">{t("menu_items_selected") || "Menu Items Selected"}</h6>
                    <Badge bg="info">
                      {editSelectedMenus.length} {t("select") || "selected"}
                    </Badge>
                  </div>

                  {/* Quick Category Filter Buttons */}
                  {safeMenuCategories && safeMenuCategories.length > 0 && (
                    <div className="mb-3">
                      <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                        <Button
                          variant={editSelectedCategoryFilter === "All" ? "primary" : "outline-secondary"}
                          size="sm"
                          onClick={() => setEditSelectedCategoryFilter("All")}
                          className="d-flex align-items-center"
                          style={{ gap: '4px' }}
                        >
                          {t("all") || "All"}
                          <span style={{ marginLeft: '4px' }}>({safeMenus?.length || 0})</span>
                        </Button>
                        {safeMenuCategories.map((category) => {
                          const stats = editGetCategoryStats[category._id];
                          const isActive = editSelectedCategoryFilter === category._id;
                          return (
                            <Button
                              key={category._id}
                              variant={isActive ? "primary" : "outline-secondary"}
                              size="sm"
                              onClick={() => setEditSelectedCategoryFilter(category._id)}
                              className="d-flex align-items-center"
                              style={{ gap: '4px' }}
                            >
                              {category.name}
                              {/* <span style={{ marginLeft: '4px' }}>
                                ({stats?.selected || 0}/{stats?.count || 0})
                              </span> */}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search and Select All */}
                  <Row className="mb-3">
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        placeholder={t("search_menu_items") || "Search menu items..."}
                        value={editSearchTerm}
                        onChange={(e) => setEditSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Check
                        type="checkbox"
                        label={
                          editSelectedCategoryFilter !== "All" 
                            ? (editSelectAll 
                                ? `${t("deselect_all") || "Deselect All"} (${editGetCategoryStats[editSelectedCategoryFilter]?.name})` 
                                : `${t("select_all") || "Select All"} (${editGetCategoryStats[editSelectedCategoryFilter]?.name})`)
                            : (editSelectAll ? t("deselect_all") || "Deselect All" : t("select_all") || "Select All")
                        }
                        checked={editSelectAll}
                        onChange={handleEditSelectAll}
                        className="mt-2"
                      />
                    </Col>
                  </Row>

                  {/* Menu Items List */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {editFilteredMenus && editFilteredMenus.length > 0 ? (
                      <Row className="g-2 row-cols-1 row-cols-md-2 row-cols-lg-3 rounded-sm">
                        {editFilteredMenus.map((menu) => (
                          <Col md={6} key={menu._id} className="mb-2 rounded-sm">
                            <Card 
                              className={`h-100 cursor-pointer ${
                                editSelectedMenus.includes(menu._id) ? 'border-primary bg-light' : ''
                              }`}
                              onClick={() => handleEditMenuSelect(menu._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <Card.Body className="p-2">
                                <div className="d-flex align-items-center">
                                  <Form.Check
                                    type="checkbox"
                                    checked={editSelectedMenus.includes(menu._id)}
                                    onChange={() => handleEditMenuSelect(menu._id)}
                                    className="me-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  
                                  {/* Menu Image */}
                                  {menu.images && menu.images.length > 0 && (
                                    <img
                                      src={`${URL_PHOTO_AW3}${menu.images[0]}`}
                                      alt={menu.name}
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                      }}
                                      className="me-2"
                                    />
                                  )}
                                  
                                  {/* Menu Details */}
                                  <div className="flex-grow-1">
                                    <div className="fw-bold text-truncate" style={{ fontSize: '14px' }}>
                                      {menu.name}
                                    </div>
                                    
                                    <div className="text-success small">
                                      {moneyCurrency(menu.price)}
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center text-muted py-4">
                        {editSearchTerm ? (
                          editSelectedCategoryFilter !== "All" ? 
                            `${t("no_menu_found_in_category") || "No menu found in category"} "${editGetCategoryStats[editSelectedCategoryFilter]?.name || editSelectedCategoryFilter}"` :
                            t("no_menu_found") || "No menu found"
                        ) : (
                          editSelectedCategoryFilter !== "All" ? 
                            `${t("no_menu_in_category") || "No menu in category"} "${editGetCategoryStats[editSelectedCategoryFilter]?.name || editSelectedCategoryFilter}"` :
                            t("no_menu_available") || "No menu available"
                        )}
                      </div>
                    )}
                  </div>

                  {/* Category Selection Summary */}
                  {/* {editSelectedMenus.length > 0 && safeMenuCategories && (
                    <div className="border-top pt-3 mt-3">
                      <div className="mb-2">
                        <h6 className="mb-0">{t("selection_summary_by_category") || "Selection Summary by Category"}</h6>
                      </div>
                      <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                        {Object.entries(editGetCategoryStats).map(([categoryId, stats]) => {
                          if (stats.selected === 0) return null;
                          return (
                            <Badge 
                              key={categoryId}
                              bg="primary" 
                              style={{ fontSize: '12px', padding: '6px 10px' }}
                            >
                              {stats.name}: {stats.selected}/{stats.count}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )} */}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <small className="text-muted">
                    {editSelectedMenus.length > 0 && (
                      `${editSelectedMenus.length} ${t("menu_items_selected") || "menu items selected"}`
                    )}
                  </small>
                  <div>
                    <Button variant="secondary" onClick={handleClose2} className="me-2">
                  {t("cancel")}
                </Button>
                <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                      type="submit"
                      disabled={isSubmitting}
                >
                      {isSubmitting ? t("updating...") || "Updating..." : t("save")}
                </Button>
                  </div>
                </div>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>

      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>{t("would_delete")}? </div>
            <div style={{ color: "red" }}>{dateDelete?.name}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            {t("cancel")}
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _confirmeDelete()}
          >
            {t("approve_delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
