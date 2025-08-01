import React, { useState, useMemo, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { URL_PHOTO_AW3 } from "../../constants";
import { moneyCurrency } from "../../helpers";

const PopUpAddCategoryType = ({ open, onClose, onSubmit, storeId, menus, menuCategories }) => {
  const { t } = useTranslation();
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Safety checks for props
  const safeMenus = menus || [];
  const safeMenuCategories = menuCategories || [];

  // console.log("menuCategories", menuCategories);
  // console.log("menus", menus);

  // Filter menus based on search term and category
  const filteredMenus = useMemo(() => {
    if (!safeMenus || !Array.isArray(safeMenus)) return [];
    
    let filtered = safeMenus.filter((menu) =>
      menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by category if not "All"
    if (selectedCategoryFilter !== "All") {
      filtered = filtered.filter((menu) => 
        menu.categoryId?._id === selectedCategoryFilter ||
        menu.categoryId === selectedCategoryFilter
      );
    }

    return filtered;
  }, [safeMenus, searchTerm, selectedCategoryFilter]);

  // Handle individual menu selection
  const handleMenuSelect = (menuId) => {
    setSelectedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all filtered items
      const filteredMenuIds = filteredMenus.map(menu => menu._id);
      setSelectedMenus(prev => prev.filter(id => !filteredMenuIds.includes(id)));
    } else {
      // Select all filtered items (add them to existing selection)
      const filteredMenuIds = filteredMenus.map(menu => menu._id);
      setSelectedMenus(prev => {
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

  // Reset form when modal closes
  const handleClose = () => {
    setSelectedMenus([]);
    setSearchTerm("");
    setSelectAll(false);
    setSelectedCategoryFilter("All");
    onClose();
  };

  // Get category statistics
  const getCategoryStats = useMemo(() => {
    if (!safeMenus || !Array.isArray(safeMenus) || !safeMenuCategories) return {};
    
    const stats = {};
    safeMenuCategories.forEach(category => {
      const categoryMenus = safeMenus.filter(menu => 
        menu.categoryId?._id === category._id || menu.categoryId === category._id
      );
      stats[category._id] = {
        name: category.name,
        count: categoryMenus.length,
        selected: categoryMenus.filter(menu => selectedMenus.includes(menu._id)).length
      };
    });
    
    return stats;
  }, [safeMenus, safeMenuCategories, selectedMenus]);

  // Update selectAll state based on current filter
  useEffect(() => {
    if (filteredMenus.length === 0) {
      setSelectAll(false);
    } else {
      const allFilteredSelected = filteredMenus.every(menu => 
        selectedMenus.includes(menu._id)
      );
      setSelectAll(allFilteredSelected);
    }
  }, [filteredMenus, selectedMenus]);

  // Early return if critical dependencies are missing
  if (!t) {
    console.error("Translation function not available");
    return null;
  }

  return (
    <Modal show={open} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("create_category")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ 
          name: "", 
          storeId: storeId,
          selectedMenus: []
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = t("please_add_category");
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          // Include selected menus in the submission
          const submitData = {
            ...values,
            selectedMenus: selectedMenus
          };
          onSubmit(submitData);
          setSubmitting(false);
          handleClose();
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
            <Modal.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {/* Category Name Section */}
              <Form.Group controlId="name" className="mb-4">
                <Form.Label htmlFor="name">{t("food_category")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder={t("enter_category")}
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
                  <h6 className="mb-0">{t("menu_items_selected")}</h6>
                  <Badge bg="info">
                    {selectedMenus.length} {t("select")}
                  </Badge>
                </div>

                {/* Category Filter */}
                {/* {safeMenuCategories && safeMenuCategories.length > 0 && (
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="small">{t("filter_by_category") || "Filter by Category"}:</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          size="sm"
                        >
                          <option value="All">{t("all_categories") || "All Categories"} ({safeMenus?.length || 0})</option>
                          {safeMenuCategories.map((category) => {
                            const stats = getCategoryStats[category._id];
                            return (
                              <option key={category._id} value={category._id}>
                                {category.name} ({stats?.count || 0})
                                {stats?.selected > 0 && ` - ${stats.selected} ${t("selected") || "selected"}`}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                )} */}

                {/* Quick Category Filter Buttons */}
                {safeMenuCategories && safeMenuCategories.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                      <Button
                        variant={selectedCategoryFilter === "All" ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => setSelectedCategoryFilter("All")}
                        className="d-flex align-items-center"
                        style={{ gap: '4px' }}
                      >
                        {t("all")}
                        {/* <Badge bg={selectedCategoryFilter === "All" ? "light" : "secondary"}>
                          {safeMenus?.length || 0}
                        </Badge> */}
                      </Button>
                      {safeMenuCategories.map((category) => {
                        const stats = getCategoryStats[category._id];
                        const isActive = selectedCategoryFilter === category._id;
                        return (
                          <Button
                            key={category._id}
                            variant={isActive ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={() => setSelectedCategoryFilter(category._id)}
                            className="d-flex align-items-center"
                            style={{ gap: '4px' }}
                          >
                            {category.name}
                            {/* <Badge bg={isActive ? "light" : "secondary"}>
                              {stats?.selected || 0}/{stats?.count || 0}
                            </Badge> */}
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label={
                        selectedCategoryFilter !== "All" 
                          ? (selectAll 
                              ? `${t("deselect_all") || "Deselect All"} (${getCategoryStats[selectedCategoryFilter]?.name})` 
                              : `${t("select_all") || "Select All"} (${getCategoryStats[selectedCategoryFilter]?.name})`)
                          : (selectAll ? t("deselect_all") || "Deselect All" : t("select_all") || "Select All")
                      }
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="mt-2"
                    />
                  </Col>
                </Row>

                {/* Menu Items List */}
                <div style={{ maxHeight: '300px', overflowY: 'auto', }}>
                  {filteredMenus && filteredMenus.length > 0 ? (
                    <Row className="g-2 row-cols-1 row-cols-md-2 row-cols-lg-3 rounded-sm">
                      {filteredMenus.map((menu) => (
                        <Col md={6} key={menu._id} className="mb-2 rounded-sm">
                          <Card 
                            className={`h-100 cursor-pointer ${
                              selectedMenus.includes(menu._id) ? 'border-primary bg-light' : ''
                            }`}
                            onClick={() => handleMenuSelect(menu._id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Body className="p-2">
                              <div className="d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedMenus.includes(menu._id)}
                                  onChange={() => handleMenuSelect(menu._id)}
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
                                  
                                  {/* Category Badge */}
                                  {/* {menu.categoryId && (
                                    <div className="mb-1">
                                      <Badge 
                                        bg="secondary" 
                                        style={{ fontSize: '10px', padding: '2px 6px' }}
                                      >
                                        {typeof menu.categoryId === 'object' 
                                          ? menu.categoryId.name 
                                          : safeMenuCategories?.find(cat => cat._id === menu.categoryId)?.name || t("unknown_category")
                                        }
                                      </Badge>
                                    </div>
                                  )} */}
                                  
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
                      {searchTerm ? (
                        selectedCategoryFilter !== "All" ? 
                          `${t("no_menu_found_in_category")} "${getCategoryStats[selectedCategoryFilter]?.name || selectedCategoryFilter}"` :
                          t("no_menu_found")
                      ) : (
                        selectedCategoryFilter !== "All" ? 
                          `${t("no_menu_in_category")} "${getCategoryStats[selectedCategoryFilter]?.name || selectedCategoryFilter}"` :
                          t("no_menu_available")
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Selection Summary */}
              {selectedMenus.length > 0 && safeMenuCategories && (
                <div className="border-top pt-3 mt-3">
                  <div className="mb-2">
                    <h6 className="mb-0">{t("selection_summary_by_category")}</h6>
                  </div>
                  <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                    {Object.entries(getCategoryStats).map(([categoryId, stats]) => {
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
              )}
            </Modal.Body>
            
            <Modal.Footer>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <small className="text-muted">
                  {selectedMenus.length > 0 && (
                    `${selectedMenus.length} ${t("menu_items_selected")}`
                  )}
                </small>
                <div>
                  <Button variant="secondary" onClick={handleClose} className="me-2">
                    {t("cancel")}
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("creating...") : t("add")}
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default PopUpAddCategoryType;
