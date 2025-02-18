import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useTranslation } from "react-i18next";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
const Promotion = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="flex flex-row justify-between items-center overflow-hidden bg-white px-4 py-3">
        <CardTitle className="text-xl">ລາຍການຂອງໂປຣໂມຊັນ</CardTitle>
        <button
          onClick={handleOpenModal}
          className="bg-color-app hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
        >
          ເພີ່ມລາຍການ
        </button>
      </Card>
      <Card className="bg-white rounded-xl overflow-hidden mt-2">
        <div className="border rounded-md relative h-full">
          <div className="overflow-y-auto max-h-[640px] overscroll-none">
            <table className="w-full rounded-2xl">
              <tr className="text-gray-500 sticky top-0">
                <th style={{ textAlign: "left" }}>ລຳດັບ</th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ຊື່ຮ້ານ
                </th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ລາຍຮັບທັງໝົດ
                </th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ຈັດການ
                </th>
              </tr>
              {/* {branchInCome?.length > 0 &&
                branchInCome?.map((data, index) => ( */}
              <tr>
                {/* <td style={{ textAlign: "left" }}>{index + 1}</td> */}
                <td style={{ textAlign: "start", padding: "0 24px" }}>aaaa</td>
                <td style={{ textAlign: "center", padding: "0 16px" }}>
                  fffff{" "}
                </td>
                <td
                  style={{
                    textAlign: "start",
                    fontWeight: "bold",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  {/* <Button
                        onClick={() =>
                          navigate(`/branch/detail/${data?.storeId?._id}`, {
                            state: { storeId: data?.storeId?._id },
                          })
                        }
                        variant="primary"
                        style={{ marginLeft: 10, fontWeight: "bold" }}
                      >
                        <FaEllipsisH />
                      </Button> */}
                  {/* <Button
                        onClick={() => handleShowPopup(data)}
                        variant="primary"
                        style={{ marginLeft: 10, fontWeight: "bold" }}
                        hidden={data?.storeId?._id === storeDetail?._id}
                      >
                        <FaTrash />
                      </Button> */}
                </td>
              </tr>
              {/* ))} */}
            </table>
          </div>
        </div>
      </Card>

      <Modal show={openModal} size="lg" onHide={() => setOpenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("setting_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 dmd:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card className="w-[180px] h-[250px]">123</Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenModal(false)}>
            {t("cancel")}
          </Button>
          <Button variant="success">{t("close_table")}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Promotion;
