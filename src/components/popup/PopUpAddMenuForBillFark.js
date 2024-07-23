import Axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getMenus } from "../../services/menu";
import { useStore } from "../../store";
import { URL_PHOTO_AW3 } from "../../constants";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function PopUpAddMenuForBillFark({
  open,
  onClose,
  onSubmit,
  prevTax,
  callback
}) {
  const { t } = useTranslation()
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [menusData, setMenusData] = useState();
  // store
  const { storeDetail } = useStore();

  // useEffect
  useEffect(() => {
    getMenuData();
  }, [open]);
  // functions
  const getMenuData = async () => {
    try {
      setIsLoading(true);
      let findby = "?";
      findby += `storeId=${storeDetail?._id}`;
      const data = await getMenus(findby);
      setMenusData(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };
  const handleAddMenuToCanFark = async (menuId) => {
    try {
      const url = END_POINT_SEVER + "/v4/menu-fark/create/" + menuId;
      const { TOKEN } = await getLocalData();
      const data = await Axios.post(url, { canFark: true }, { headers: TOKEN });
      await Swal.fire({
        icon: "success",
        title: `${t('success')}`,
        showConfirmButton: false,
        timer: 1500,
      });
      callback()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="md">
      <Modal.Header
        closeButton
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        {t('add_able_deposit_menu')}
      </Modal.Header>
      <Modal.Body
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          width: "100%",
        }}
      >
        {/* <div style={{ display: "flex", gap: 10 }}>
          <Form.Control
            type="number"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <Button>ຄົ້ນຫາ</Button>
        </div> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "25% 25% 25% 25%",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          {menusData?.map((e) => (
            <div style={{ padding: 2 }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  overflow: "hidden",
                  padding: 5,
                  borderRadius: 8,
                }}
              >
                <div style={{ height: 100, width: "100%" }}>
                  <img
                    src={
                      e?.images?.[0]
                        ? URL_PHOTO_AW3 + e?.images?.[0]
                        : "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                    }
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ textWrap: "nowrap" }}>{e?.name}</div>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    handleAddMenuToCanFark(e?._id);
                  }}
                >
                  {t('add')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
