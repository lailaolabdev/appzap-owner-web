import React, { useState } from "react";
import { Button, Modal, Card, Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function PermissionsForCounters() {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseDelete = () => setShowDelete(false);

  return (
    <>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("bank")}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          <Tab eventKey="currency-list" style={{ paddingTop: 20 }}>
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: "#007bff",
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
                  <BsCurrencyExchange /> {t("main_Bank")}
                </span>
                <Button variant="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("add_Bank")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>{t("bank_Name")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample data for display */}
                    <tr>
                      <td className="text-left">1</td>
                      <td className="text-left">Sample Bank</td>
                      <td className="text-left">
                        <Button variant="link" onClick={() => setShowEdit(true)}>
                          {t("edit")}
                        </Button>
                        <Button
                          variant="link"
                          style={{ color: "red" }}
                          onClick={() => setShowDelete(true)}
                        >
                          {t("delete")}
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Create Modal */}
        <Modal
          show={showAdd}
          onHide={handleCloseAdd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("add_Bank")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t("please_enter_the_bank_name")}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAdd}>
              {t("cancel")}
            </Button>
            <Button variant="primary">{t("save")}</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit_Bank")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t("edit_the_bank_name")}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              {t("cancel")}
            </Button>
            <Button variant="primary">{t("save")}</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDelete}
          onHide={handleCloseDelete}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("delete_Bank")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t("confirm_delete_bank")}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button variant="danger">{t("delete")}</Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
