import { React, useEffect, useState } from "react";
import {
  Modal,
  Button,
  ListGroup,
  Form,
  Row,
  Col,
  Card,
  Pagination,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { FaUser } from "react-icons/fa";
import { getLocalData } from "../../constants/api";
import { getMembers, getMemberAllCount } from "../../services/member.service";
import { useStore } from "../../store";
import { useTranslation } from "react-i18next";

export default function PopUpMemberOrder({
  open,
  onClose,
  onSelectMember,
  setData,
}) {
  const { t } = useTranslation();
  const [membersData, setMembersData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [paginationMember, setPaginationMember] = useState(1);
  const [totalPaginationMember, setTotalPaginationMember] = useState(0);
  const limitData = 20; // Set your limit value

  const { storeDetail, setStoreDetail } = useStore();

  const getMembersData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      let findby = "?";
      findby += `storeId=${DATA?.storeId}&`;
      findby += `skip=${(paginationMember - 1) * limitData}&`;
      findby += `limit=${limitData}&`;
      if (filterValue) {
        findby += `search=${filterValue}&`; // Add search parameter for filtering by phone or name
      }
      const _data = await getMembers(findby, TOKEN);
      if (_data.error) throw new Error("error");
      setMembersData(_data?.data?.data);
      setTotalPaginationMember(Math.ceil(_data?.data?.memberCount / limitData));
    } catch (err) {
      console.error("Error fetching members data", err);
    }
  };

  const getMemberCountData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const _data = await getMemberAllCount(DATA?.storeId, TOKEN);
      if (_data.error) throw new Error("error");
      // setTotalPaginationMember(Math.ceil(_data?.count / limitData));
    } catch (err) {}
  };

  const handleMemberClick = async (member) => {
    // console.log(member);
    setStoreDetail({ ...storeDetail, selectedMemberID: member._id });
    onSelectMember(member._id);
    setData(member.name);
    onClose();
  };

  useEffect(() => {
    getMembersData();
  }, [open, filterValue, paginationMember]);

  useEffect(() => {
    getMemberCountData();
  }, []);

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ເລືອກຊື່ສະມາຊິກ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <Form.Control
              placeholder="ຄົ້ນຫາຊື່ສະມາຊິກ"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button onClick={getMembersData} variant="primary">
              ຄົ້ນຫາ
            </Button>
          </Col>
        </Row>
        <Row className="p-2">
          {membersData?.map((e) => (
            <div key={e.id} className="m-2">
              <Button
                variant="outline-primary"
                style={{ borderRadius: 6 }}
                onClick={() => handleMemberClick(e)}
              >
                <FaUser style={{ marginRight: "8px" }} />
                {e.name}
              </Button>
            </div>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <ReactPaginate
          previousLabel={
            <span className="glyphicon glyphicon-chevron-left">
              {t("previous")}
            </span>
          }
          nextLabel={
            <span className="glyphicon glyphicon-chevron-right">
              {t("next")}
            </span>
          }
          breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
          breakClassName={"break-me"}
          pageCount={totalPaginationMember} // Replace with the actual number of pages
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={(e) => {
            console.log(e);
            setPaginationMember(e?.selected + 1);
          }}
          containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
        />
      </Modal.Footer>
    </Modal>
  );
}
