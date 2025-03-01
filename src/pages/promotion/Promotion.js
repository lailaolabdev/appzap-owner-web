import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
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
import {
  GetAllPromotion,
  DeletePromotion,
  UpdateStatusPromotion,
} from "../../services/promotion";
import { moneyCurrency } from "../../helpers";
import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";
import Loading from "../../components/Loading";

import Swal from "sweetalert2";
import { errorAdd } from "../../helpers/sweetalert";
const Promotion = () => {
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [promotion, setPromotion] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();

  const fetchDataMenu = async () => {
    if (storeDetail?._id) {
      const storeId = storeDetail?._id;

      const fetchedMenus = await getMenus(storeId);
      setMenus(fetchedMenus); // Save to zustand store

      const fetchedCategories = await getMenuCategories(storeId);
      setMenuCategories(fetchedCategories); // Save to zustand store
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [textSearch, status]);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await GetAllPromotion(textSearch, status);
    setPromotion(data);
    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const cards = [
    {
      id: 1,
      title: "Discount",
      type: "Discount",
      icon: <CiDiscount1 className="text-[80px]" />,
      description: "ການໃຫ້ສ່ວນຫຼຸດລາຄາຕາມລາຍການ",
    },
    // {
    //   id: 2,
    //   title: "Bundle Menu",
    //   type: "Bundle_Menu",
    //   icon: <PiBowlFoodBold className="text-[80px]" />,
    //   description:
    //     "ການລວມສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດ (ແບບຕັັ້ງລາຄາໃໝ່)",
    // },
    // {
    //   id: 3,
    //   title: "Bundle Set for Discount Menu",
    //   type: "Bundle_Set_for_Discount_Menu",
    //   icon: <IoFastFoodOutline className="text-[80px]" />,
    //   description:
    //     "ການລວມລາຄາຂອງສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດໃນລາຄາທີ່ຖຶກກວ່າ",
    // },
    // {
    //   id: 4,
    //   title: "Bundle Set for Menu Free",
    //   type: "Bundle_Set_for_Menu_Free",
    //   icon: <LuPartyPopper className="text-[80px]" />,
    //   description: "ການລວມສິນຄ້າຫຼາຍອັນເຂົ້ານຳກັນແລ້ວຂາຍເປັນເຊັດໂດຍມີການແຖມຟຣີ",
    // },
    {
      id: 2,
      title: "Buy 1 Get 1 Free",
      type: "Buy_1_Get_1_Free",
      icon: <BiCookie className="text-[80px]" />,
      description: "ການຊື້ສິນຄ້າ 1 ຢ່າງ ແຖມ 1 ຢ່າງ ຫຼື ຊື້ 2 ຢ່າງ ແຖມ 1 ຢ່າງ",
    },
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleChangePagePromotion = (type) => {
    if (type === "Discount") {
      navigate(`/promotion/discount/${selectedCard?.type}`);
    } else if (type === "Bundle_Menu") {
      navigate("/promotion/bundle-menu");
    } else if (type === "Bundle_Set_for_Discount_Menu") {
      navigate("/promotion/bundle-set-for-discount-menu");
    } else if (type === "Bundle_Set_for_Menu_Free") {
      navigate("/promotion/bundle-set-for-menu-free");
    } else if (type === "Buy_1_Get_1_Free") {
      navigate(`/promotion/buyXgetX/${selectedCard?.type}`);
    }
  };
  const handleChangePagePromotionEdit = (type, promotionId) => {
    if (type === "DISCOUNT") {
      navigate(`/promotion/discount/edit/${promotionId}`);
    } else if (type === "Bundle_Menu") {
      navigate("/promotion/bundle-menu");
    } else if (type === "Bundle_Set_for_Discount_Menu") {
      navigate("/promotion/bundle-set-for-discount-menu");
    } else if (type === "Bundle_Set_for_Menu_Free") {
      navigate("/promotion/bundle-set-for-menu-free");
    } else if (type === "BUY_X_GET_Y") {
      navigate(`/promotion/buyXGetX/edit/${promotionId}`);
    }
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (data) => {
    setDeleteData(data);
    setShowDelete(true);
  };

  const _confirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeletePromotion(deleteData?._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("delete_data_success"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseDelete();
          fetchData();
          fetchDataMenu();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
          fetchDataMenu();
          handleCloseDelete();
        }
      });
    } catch (error) {
      console.error("Error deleting bank:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (e, promoId) => {
    const _type = e?.target?.checked;
    const isType = _type ? "ACTIVE" : "INACTIVE";

    const data = {
      status: isType,
    };

    try {
      const response = await UpdateStatusPromotion(promoId, data);
      if (response.data) {
        fetchData();
        fetchDataMenu();
      }
    } catch (error) {
      errorAdd("ບໍ່ສາມາດເປິດໃຊ້ງານສະໄລສ໌ນີ້ໄດ້");
    }
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="bg-white rounded-xl h-full overflow-hidden mt-2">
        <div className="flex flex-row justify-between items-center overflow-hidden bg-white px-4 py-3">
          <CardTitle className="text-xl">
            ລາຍການຂອງໂປຣໂມຊັນ ({promotion?.length || 0}) ລາຍການ
          </CardTitle>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-color-app hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            ເພີ່ມລາຍການ
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center overflow-hidden bg-white px-4 py-3">
          <select
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
          >
            <option selected disabled>
              ເລຶອກສະຖະນະໂປຣໂມຊັນ
            </option>
            <option value={""}>ທັງໝົດ</option>
            <option value={"ACTIVE"}>ເປີດ</option>
            <option value={"INACTIVE"}>ປິດ</option>
          </select>
          <input
            onChange={(e) => setTextSearch(e.target.value)}
            className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
            type="text"
            placeholder="ຄົ້ນຫາ....."
          />
        </div>
        <div className="border rounded-md  mx-4 my-2">
          <div className="overflow-y-auto max-h-[640px]">
            <table className="w-full rounded-2xl">
              <tr className="bg-orange-500 text-white sticky hover:bg-orange-600  top-0 border-b">
                <th className="text-[18px] font-bold text-center">ລຳດັບ</th>
                <th className="text-[18px] font-bold text-start">
                  ຊື່ໂປຣໂມຊັນ
                </th>
                <th className="text-[18px] font-bold text-start">ປະເພດ</th>
                <th className="text-[18px] font-bold text-center">
                  ໄລຍະເວລາການໃຊ້ງານ
                </th>
                <th className="text-[18px] font-bold text-center">
                  ຈຳນວນສ່ວນຫຼຸດ/ແຖມ
                </th>
                <th className="text-[18px] font-bold text-center">ສະຖານະ</th>
                <th className="text-[18px] font-bold text-center">ຈັດການ</th>
              </tr>

              {isLoading ? (
                <Loading />
              ) : promotion?.length > 0 ? (
                promotion?.map((data, index) => (
                  <tr key={data?._id} className="border-b text-center">
                    <td className="text-left">{index + 1}</td>
                    <td className="text-start">{data?.name}</td>
                    <td className="text-start">
                      {data?.type === "DISCOUNT" ? "ສ່ວນຫຼຸດ" : "ລາຍການແຖມ"}
                    </td>
                    <td className="text-center">
                      {moment(data?.validFrom).format("DD-MM-YYYY")} -{" "}
                      {moment(data?.validUntil).format("DD-MM-YYYY")}
                    </td>
                    <td className="text-center">
                      {data?.freeItems?.length > 0
                        ? `ແຖມ ${data.freeItems.length} ລາຍການ`
                        : `${moneyCurrency(data?.discountValue)} ${
                            data?.discountType === "PERCENTAGE"
                              ? "%"
                              : storeDetail?.firstCurrency
                          }`}
                    </td>

                    <td className="text-[18px] font-bold text-center">
                      {/* <span
                        className={`px-2 py-1 rounded-md ${
                          data?.status === "ACTIVE"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {data?.status === "ACTIVE" ? "ເປີດ" : "ປິດ"}
                      </span> */}
                      <div className="flex justify-start items-center gap-2">
                        <Form.Label
                          htmlFor={"switch-status"}
                          className="text-[14px]"
                        >
                          {data?.status === "ACTIVE" ? t("oppen") : t("close")}
                        </Form.Label>
                        <Form.Check
                          type="switch"
                          checked={data?.status === "ACTIVE"}
                          id={`switch-${index}`}
                          onChange={(e) => handleUpdateStatus(e, data._id)}
                        />
                      </div>
                    </td>
                    <td className="flex gap-2 justify-center text-[18px] font-bold">
                      <button
                        type="button"
                        onClick={() =>
                          // navigate(`/promotion/discount/edit/${data?._id}`)
                          handleChangePagePromotionEdit(data?.type, data?._id)
                        }
                        className="bg-color-app hover:bg-orange-400 text-[14px] p-2 w-[60px] rounded-md text-white"
                      >
                        ແກ້ໄຂ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShowDelete(data)}
                        className="bg-red-500 hover:bg-red-400 text-[14px] p-2 w-[60px] rounded-md text-white"
                      >
                        ລົບ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="text-center py-2">
                      ຍັງບໍ່ມີລາຍການໂປຣໂມຊັນ
                    </div>
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
      </Card>

      <Modal show={openModal} size="md" onHide={() => setOpenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("ເລຶອກໂປຣໂມຊັນ")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 place-content-center place-items-center gap-1 md:grid-cols-2 lg:grid-cols-2 dmd:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
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
            onClick={() => setOpenModal(false)}
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={!selectedCard}
            onClick={() => handleChangePagePromotion(selectedCard?.type)}
            className={`${
              !selectedCard
                ? "bg-orange-300 "
                : "bg-color-app  hover:bg-orange-400 "
            } w-[150px] text-[14px] p-2 rounded-md text-white`}
          >
            {t("ຖັດໄປ")}
          </button>
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
          <Modal.Title>ລົບລາຍການໂປຣໂມຊັນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {deleteData?.name} ອອກຈາກລະບົບ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={_confirmDelete}>
            {"ລຶບ"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Promotion;
