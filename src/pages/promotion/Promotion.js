import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { CiDiscount1 } from "react-icons/ci";
import { PiBowlFoodBold } from "react-icons/pi";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuPartyPopper } from "react-icons/lu";
import { BiCookie } from "react-icons/bi";
const Promotion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const cards = [
    {
      id: 1,
      title: "Discount",
      type: "Discount",
      icon: <CiDiscount1 className="text-[80px]" />,
      description: "ການຫຼຸດລາຄາຕາມລາຍການ ຫຼື ໝວດໝູ່",
    },
    {
      id: 2,
      title: "Bundle Menu",
      type: "Bundle_Menu",
      icon: <PiBowlFoodBold className="text-[80px]" />,
      description:
        "ການລວມສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດ (ແບບຕັັ້ງລາຄາໃໝ່)",
    },
    {
      id: 3,
      title: "Bundle Set for Discount Menu",
      type: "Bundle_Set_for_Discount_Menu",
      icon: <IoFastFoodOutline className="text-[80px]" />,
      description:
        "ການລວມລາຄາຂອງສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດໃນລາຄາທີ່ຖຶກກວ່າ",
    },
    {
      id: 4,
      title: "Bundle Set for Menu Free",
      type: "Bundle_Set_for_Menu_Free",
      icon: <LuPartyPopper className="text-[80px]" />,
      description: "ການລວມສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດໂດຍມີການແຖມຟຣີ",
    },
    {
      id: 5,
      title: "Buy 1 Get 1 Free",
      type: "Buy_1_Get_1_Free",
      icon: <BiCookie className="text-[80px]" />,
      description: "ການຊື້ສິນຄ້າ 1 ຢ່າງ ແຖມ 1 ຢ່າງ ຫຼື ຊື້ 2 ຢ່າງ ແຖມ 1 ຢ່າງ",
    },
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="bg-white rounded-xl h-full overflow-hidden mt-2">
        <div className="flex flex-row justify-between items-center overflow-hidden bg-white px-4 py-3">
          <CardTitle className="text-xl">ລາຍການຂອງໂປຣໂມຊັນ (10)</CardTitle>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-color-app hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            ເພີ່ມລາຍການ
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center overflow-hidden bg-white px-4 py-3">
          <select className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md">
            <option selected disabled>
              ເລຶອກສະຖະນະໂປຣໂມຊັນ
            </option>
            <option value={"ALL"}>ທັງໝົດ</option>
            <option value={"ACTIVE"}>ເປີດ</option>
            <option value={"INACTIVE"}>ປິດ</option>
          </select>
          <input
            className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
            type="text"
            placeholder="ຄົ້ນຫາ....."
          />
        </div>
        <div className="border rounded-md  mx-4 my-2">
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
                  ຊື່ໂປຣໂມຊັນ
                </th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ໄລຍະເວລາການໃຊ້ງານ
                </th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ຈຳນວນສ່ວນຫຼຸດ
                </th>
                <th
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ສະຖານະ
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
          <Modal.Title>{t("ເລຶອກໂປຣໂມຊັນ")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 dmd:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`w-[180px] h-[240px] cursor-pointer ${
                  selectedCard?.id === card.id
                    ? "border-2 border-color-app bg-color-app text-white"
                    : ""
                }`}
                onClick={() => handleCardClick(card)}
              >
                <div className="flex flex-col items-center mt-2 px-2">
                  {card.icon}
                  <h3 className="text-[16px] font-bold mt-2 text-center">
                    {card.title}
                  </h3>
                  <p className="text-[14px] px-2 text-center">
                    {card.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button
            type="button"
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(`/promotion/discount/${selectedCard?.type}`)
            }
            className="bg-color-app w-[150px] hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("ຖັດໄປ")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Promotion;
