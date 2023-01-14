import { useState } from "react";
import { Modal, Alert, Table } from "react-bootstrap";
import "./Card.css";
import { BsXCircleFill } from "react-icons/bs";
import ButtonPrimary from "../../components/button/ButtonPrimary";
export default function TableList() {
  // modalCheckBin
  const [showcheckbin, setShowCheckBin] = useState(false);
  const handleCloseCheckBin = () => setShowCheckBin(false);
  const handleShowCheckBin = () => setShowCheckBin(true);

  // modalRemoveTable
  const [showremovetable, setShowRemoveTable] = useState(false);
  const handleCloseRemoveTable = () => setShowRemoveTable(false);
  const handleShowRemoveTable = () => setShowRemoveTable(true);

  // modalpoint
  const [showpoint, setShowPoint] = useState(false);
  const handleClosePoint = () => setShowPoint(false);
  const handleShowPoint = () => setShowPoint(true);

  // modalpoint
  const [showreturnproduct, setShowReturnProduct] = useState(false);
  const handleCloseReturnProduct = () => setShowReturnProduct(false);
  const handleShowReturnProduct = () => setShowReturnProduct(true);

  const data = [
    {
      title: "Table1",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table2",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
    {
      title: "Table3",
      id: "2021515",
      status: "ວ່າງ",
    },
  ];

  const table = [
    {
      title: "table1",
      id: "8415",
      check: "true",
    },
    {
      title: "table2",
      id: "8415",
      check: "true",
    },
    {
      title: "table3",
      id: "8415",
      check: "true",
    },
    {
      title: "table4",
      id: "8415",
      check: "true",
    },
  ];

  return (
    <>
      <div class="left">
        <center>
          <b>ໂຕະທັງໜົດ : 20 ໂຕະ</b>
        </center>
        <div className="Box">
          {data.map((e) => (
            <>
              <div className="menu-setiing">
                <p style={{ fontWeight: "bold", paddingTop: "10px" }}>
                  {e.title}
                </p>
                <small>{e.id}</small>
                <p style={{ paddingTop: "10px" }}>{e.status}</p>
              </div>
            </>
          ))}
        </div>
      </div>

      <div class="right">
        <span style={{ display: "flex", alignItems: "center" }}>
          <span>
            <b style={{ fontSize: "40px" }}>Table1</b>
            <p>ລະຫັດເຂົ້າໂຕະ : 011515</p>
          </span>
          <span style={{ paddingLeft: "20%" }}>
            <b>ສະຖານະໂຕະ : ກຳລັງໃຊ້ງານ</b>
            <p>ຜູ້ຮັບຜິດຊອບ : Lailaolab Solution</p>
          </span>
        </span>
        <div className="Box-menu">
          <div className="menu-table">
            <BsXCircleFill size={15} /> &ensp; ປິດໂຕະ
          </div>
          <p style={{ width: "20px" }}></p>
          <div
            className="menu-table"
            onClick={handleShowRemoveTable}
            style={{ cursor: "pointer" }}
          >
            <BsXCircleFill size={15} /> &ensp; ຍ້າຍໂຕະ
          </div>
          <p style={{ width: "20px" }}></p>
          <div
            className="menu-table"
            onClick={handleShowReturnProduct}
            style={{ cursor: "pointer" }}
          >
            <BsXCircleFill size={15} /> &ensp; ເສີບອາຫານຜິດໂຕະ
          </div>
          <p style={{ width: "20px" }}></p>
          <div
            className="menu-table"
            onClick={handleShowPoint}
            style={{ cursor: "pointer" }}
          >
            <BsXCircleFill size={15} /> &ensp; ເພີ່ມສວ່ນຫຼຸດ
          </div>
          <p style={{ width: "20px" }}></p>
          <div
            className="menu-table"
            onClick={handleShowCheckBin}
            style={{ cursor: "pointer" }}
          >
            <BsXCircleFill size={15} /> &ensp; ຄິດໄລ່ເງີນ
          </div>
          <p style={{ width: "20px" }}></p>
          <div
            className="menu-table"
            // onClick={() => history.push("/addorder")}
            style={{ cursor: "pointer" }}
          >
            <BsXCircleFill size={15} /> &ensp; ເພີ່ມ
          </div>
        </div>
        <table class="table mt-2">
          <thead style={{ backgroundColor: "red", color: "white" }}>
            <tr>
              <th scope="col"></th>
              <th scope="col">ລດ</th>
              <th scope="col">ເມນູ</th>
              <th scope="col">ຈຳນວນ</th>
              <th scope="col">ສະຖານະ</th>
              <th scope="col">ໜາຍເຫດ</th>
              <th scope="col">ຜູ້ສົ່ງ</th>
              <th scope="col">ເວລາ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"></th>
              <td>1</td>
              <td>ເເກງເຫັດລວມ</td>
              <td>1</td>
              <td>ເສີບເເລ້ວ</td>
              <td>-</td>
              <td>lailaolab</td>
              <td>21/10/2022 12:00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* checkbin */}
      <Modal
        show={showcheckbin}
        onHide={handleCloseCheckBin}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          closeButton
        >
          <Modal.Title centered>ລາຍການເຊັກບິນ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "black",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "25px", fontWeight: "bold" }}>Table 3 </p>
                &ensp; <p>ລະຫັດ : 563258</p>
              </span>

              <span>ເປີດເມື່ອ : 25/2/2022 </span>
            </div>
          </Alert>
          <Table striped>
            <thead>
              <tr>
                <th>ລຳດັບ</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ລາຄາ</th>
                <th>ລາຄາລວມ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ເບຍ</td>
                <td>5</td>
                <td>20</td>
                <td>5000</td>
              </tr>
              <tr>
                <td>1</td>
                <td>ເບຍ</td>
                <td>5</td>
                <td>20</td>
                <td>5000</td>
              </tr>
            </tbody>
          </Table>
          <span style={{ display: "flex", justifyContent: "flex-end" }}>
            <b>ລາຄາລວມ</b>
            <span style={{ width: "20%" }}></span>
            <b>90,000 ກີບ</b>
          </span>
          <div style={{ paddingTop: "10px", paddingBottom: "30px" }}>
            <span style={{ display: "flex", justifyContent: "flex-end" }}>
              <b>ສວ່ນຫຼຸດ</b>
              <span style={{ width: "20%" }}></span>
              <b>90,000 ກີບ</b>
            </span>
          </div>

          <Alert variant="success">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <b style={{ fontSize: "25px" }}>ເງີນທີ່ຕອ້ງຊໍາລະ</b>
              <span style={{ width: "20%" }}></span>
              <b style={{ fontSize: "25px" }}>90,000 ກີບ</b>
            </div>
          </Alert>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "30px",
              paddingBottom: "30px",
            }}
          >
            <ButtonPrimary
              style={{
                backgroundColor: "#929397",
                width: "150px",
                color: "white",
              }}
            >
              ພີມບິນ
            </ButtonPrimary>

            <ButtonPrimary
              style={{
                marginLeft: "30px",
                width: "150px",
                backgroundColor: "orange",
                color: "white",
              }}
            >
              ຄິດໄລ່ເງີນ
            </ButtonPrimary>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal remove table */}

      <Modal
        show={showremovetable}
        onHide={handleCloseRemoveTable}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Modal.Title>ລວມໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "25px",
            }}
          >
            <b>ຍ້ານຈາກໂຕະ : Table3</b>
            <b>ໄປຫາໂຕະ : -</b>
          </span>
          {table.map((e) => (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  marginBottom: "10px",
                  padding: "1rem",
                  marginTop: "10px",
                  boxShadow: "1px 2px 9px #F4AAB9",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    <b>{e.title}</b>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "center",
                      alignItems: "center",
                      lineHeight: "1",
                    }}
                  >
                    <b>{e.id}</b>
                    <b>{e.check}</b>
                  </span>
                </span>
              </div>

              <span style={{ height: "20px" }}></span>
            </>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingTop: "30px",
              paddingBottom: "30px",
            }}
          >
            <ButtonPrimary
              style={{ width: "20%", backgroundColor: "wheat" }}
              onClick={handleCloseRemoveTable}
            >
              ຍົກເລີກ
            </ButtonPrimary>
            <ButtonPrimary
              style={{ width: "20%", marginLeft: "20px", color: "white" }}
            >
              ລວມໂຕະ
            </ButtonPrimary>
          </div>
        </Modal.Body>
      </Modal>

      {/* ສວ່ນຫຼຸດ */}

      <Modal
        show={showpoint}
        onHide={handleClosePoint}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Modal.Title>
            <b>ເພີ່ມສວ່ນຫຼຸດ</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped>
            <thead>
              <tr>
                <th>ລຳດັບ</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ລາຄາ</th>
                <th>ລາຄາລວມ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ເບຍ</td>
                <td>5</td>
                <td>20</td>
                <td>5000</td>
              </tr>
              <tr>
                <td>1</td>
                <td>ເບຍ</td>
                <td>5</td>
                <td>20</td>
                <td>5000</td>
              </tr>
            </tbody>
          </Table>
          <Alert variant="success">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <b>ສວ່ນຫຼຸດ :</b>
              <ButtonPrimary
                style={{
                  width: "100px",
                  marginLeft: "10px",
                  backgroundColor: "white",
                }}
              >
                %
              </ButtonPrimary>
              <ButtonPrimary
                style={{ width: "100px", marginLeft: "10px", color: "white" }}
              >
                ກີບ
              </ButtonPrimary>
              <input
                type="number"
                className="form-control w-25"
                style={{ marginLeft: "10px" }}
              />
              <b style={{ marginLeft: "10px" }}>ກີບ</b>
            </div>
          </Alert>
          <span
            style={{ display: "flex", justifyContent: "end", fontSize: "25px" }}
          >
            <b>ເງີນທີ່ຕອ້ງຊໍາລະ : 0 ກີບ</b>
          </span>
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              justifyContent: "end",
            }}
          >
            <ButtonPrimary
              style={{ color: "white", width: "20%" }}
              onClick={handleClosePoint}
            >
              ຍົກເລີກ
            </ButtonPrimary>
            <ButtonPrimary
              style={{ color: "white", width: "20%", marginLeft: "30px" }}
            >
              ເພີ່ມສວ່ນຫຼຸດ
            </ButtonPrimary>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal Return Product */}

      <Modal
        show={showreturnproduct}
        onHide={handleCloseReturnProduct}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Modal.Title>
            <b>ສົ່ງຄືນສິນຄ້າ</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped>
            <thead>
              <tr>
                <th>ລຳດັບ</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th style={{ width: "20%" }}>ຈຳນວນສົ່ງຄືນ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ເບຍ</td>
                <td>5</td>
                <td>
                  <input type="number" className="form-control" />
                </td>
              </tr>
            </tbody>
          </Table>

          <div
            style={{
              display: "flex",
              marginTop: "30px",
              justifyContent: "end",
            }}
          >
            <ButtonPrimary
              style={{ color: "white", width: "20%" }}
              onClick={handleCloseReturnProduct}
            >
              ຍົກເລີກ
            </ButtonPrimary>
            <ButtonPrimary
              style={{ color: "white", width: "20%", marginLeft: "30px" }}
            >
              ບັນທືກ
            </ButtonPrimary>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
