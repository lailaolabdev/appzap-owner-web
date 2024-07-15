import { React, useState, useEffect } from "react";
import { Modal, Row, Button } from "react-bootstrap";
import { getMemberAllMenu } from "../../services/member.service";
import { getLocalData } from "../../constants/api";
import { COLOR_APP } from "../../constants";
import Box from "../Box";

export default function PopUpMemberOrderAll({
  open,
  onClose,
  setSelectedMenu
}) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allMenu, setAllMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    getMemberAllMenus();
  }, [open]);

  const getMemberAllMenus = async () => {
    try {
      const { TOKEN } = await getLocalData();
      const _data = await getMemberAllMenu(TOKEN);
      if (_data.error) throw new Error("error");
      setAllMenu(_data);
    } catch (err) {
      console.error("Error fetching All Menu", err);
    }
  };

  const toggleSelection = (menuId) => {
    const _selectedMenus = [...selectedItems];
    const isMenuSelected = _selectedMenus.some((menu) => menu === menuId);

    if (!isMenuSelected) {
      setSelectedItems([..._selectedMenus, menuId]);
    } else {
      const updatedSelectedMenus = _selectedMenus.filter(
        (menu) => menu !== menuId
      );
      setSelectedItems(updatedSelectedMenus);
    }
  };

  const isItemSelected = (menuId) => {
    return selectedItems.some((menu) => menu === menuId);
  };

  return (
    <div>
      <Modal show={open} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>ເລືອກຊື່ເມນູ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "grid",
                gap: 6,
                gridTemplateColumns: {
                  md: "1fr 1fr 1fr 1fr 1fr",
                  sm: "1fr 1fr 1fr",
                  xs: "1fr 1fr"
                }
              }}
            >
              {allMenu &&
                allMenu?.map((menu, index) => (
                  <div key={"table" + index}>
                    <Box
                      sx={{
                        display: { md: "block", xs: "none" }
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border:
                            "1px solid" +
                            (isItemSelected(menu?._id) ? COLOR_APP : "#EEE"),
                          borderRadius: 8,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          padding: 10,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          toggleSelection(menu?._id);
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            float: "right",
                            right: 10,
                            top: 10
                          }}
                        ></div>
                        <div>
                          <span
                            style={{
                              fontSize: 16
                            }}
                          >
                            <div>{menu?.name}</div>
                          </span>
                        </div>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        display: { md: "none", xs: "block" }
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: 8,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          padding: 10
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            float: "right",
                            right: 10,
                            top: 10
                          }}
                        ></div>
                        <div>
                          <span>
                            <div>{menu?.name}</div>
                            {/* <div>{table?.code}</div> */}
                          </span>
                        </div>
                      </div>
                    </Box>
                  </div>
                ))}
            </Box>
          </div>
          {/* <Row className="p-2">
            {allMenu.map((e) => (
              <div key={e.id} className="m-2">
                <Button
                  variant="outline-primary"
                  style={{ borderRadius: 6 }}
                  onClick={() => toggleSelection(e)}
                >
                  {e.name}
                </Button>
              </div>
            ))}
          </Row> */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>ຍົກເລີກ</Button>
          <Button
            disabled={buttonDisabled}
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => {
              
              setSelectedMenu(selectedItems);
              onClose();
            }}
            // onClick={handleConfirm}
          >
            ຢືນຢັນ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
