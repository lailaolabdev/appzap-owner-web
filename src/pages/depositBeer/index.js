/** @format */

import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { formatDateNow } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function DepositBeer() {
  const [startDate, setStartDate] = useState(formatDateNow(new Date()));
  const [endDate, setEndDate] = useState(formatDateNow(new Date()));
  const [seletedOrderItem, setSeletedOrderItem] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showDetail, setShowDetail] = useState(false);
  const handleCloseDetail = () => setShowDetail(false);
  const handleShowDetail = () => setShowDetail(true);

  function handleSetQuantity(int, seletedOrderItem) {
    let _data = seletedOrderItem?.quantity + int;
    if (_data > 0) {
      setSeletedOrderItem({ ...seletedOrderItem, quantity: _data });
    }
  }
  return (
    <div>
      <div
        style={{
          padding: 40,
          display: "flex",
          justifyItems: "end",
          justifyContent: "end",
        }}>
        <Button variant='primary' onClick={() => handleShow()}>
          ເປີດບີນຝາກເບຍ
        </Button>
      </div>
      <div style={{ paddingLeft: 40, paddingRight: 40 }}>
        <table className='table'>
          <thead className='thead-dark' style={{ textAlign: "center" }}>
            <tr>
              <th>#</th>
              <th scope='col'>ຊື່ສີນຄ້າ</th>
              <th scope='col'>ຈຳນວນ</th>
              <th scope='col'>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={()=>handleShowDetail()}>
              <th scope='row'>1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>
                <Button variant='secondary' onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button variant='secondary' onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button variant='success' onClick={handleClose}>
                  ເບີກເຄືອງ
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal show={showDetail} size='lg' onHide={handleCloseDetail}>
        <Modal.Header closeButton>
          <Modal.Title>ບີນຝາກເບຍ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>ລະຫັດໂຕະ : </p>
            <p>ໂຕະ : </p>
            <p>ເລກທີບີນຝາກ : </p>
            <p>ຊື່ລູກຄ້າ : </p>
            <p>ວັນທີຝາກເບຍ :  , ກຳນົດຝາກ : </p>
            <table className='table' striped bordered hover>
              <thead className='thead-dark' style={{ textAlign: "center" }}>
                <tr>
                  <th>#</th>
                  <th>ຊື່ສີນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ເບຍລາວ</td>
                  <td>
                    1
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={show} size='lg' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ເປີດບີນຝາກເບຍ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>ລະຫັດໂຕະ</Form.Label>
                <Form.Control type='text' placeholder='ລະຫັດໂຕະ' />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>ໂຕະ</Form.Label>
                <Form.Control type='text' placeholder='ໂຕະ' />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>ເລກທີບີນຝາກ</Form.Label>
                <Form.Control type='text' placeholder='ເລກທີບີນຝາກ' />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label>ຊື່ລູກຄ້າ</Form.Label>
                <Form.Control type='text' placeholder='ຊື່ລູກຄ້າ' />
              </Form.Group>
              <div style={{ display: "flex" }}>
                <Form.Group
                  className='mb-3 col-6'
                  controlId='formBasicPassword'>
                  <Form.Label>ວັນທີຝາກເບຍ</Form.Label>
                  <Form.Control
                    type='date'
                    defaultValue={startDate}
                    placeholder='ວັນທີຝາກເບຍ'
                  />
                </Form.Group>
                <Form.Group
                  className='mb-3 col-6'
                  controlId='formBasicPassword'>
                  <Form.Label>ກຳນົດຝາກ</Form.Label>
                  <Form.Control
                    type='date'
                    defaultValue={endDate}
                    placeholder='ກຳນົດຝາກ'
                  />
                </Form.Group>
              </div>
            </Form>
            <table className='table' striped bordered hover>
              <thead className='thead-dark' style={{ textAlign: "center" }}>
                <tr>
                  <th>#</th>
                  <th>ຊື່ສີນຄ້າ</th>
                  <th>ຈຳນວນ</th>
                  <th>ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ເບຍລາວ</td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <button
                      style={{ color: "blue", border: "none", width: 25 }}
                      onClick={() => handleSetQuantity(-1, seletedOrderItem)}>
                      -
                    </button>
                    {seletedOrderItem?.quantity ? 1 : 0}
                    <button
                      style={{ color: "red", border: "none", width: 25 }}
                      onClick={() => handleSetQuantity(1, seletedOrderItem)}>
                      +
                    </button>
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className='delete-img'
                      //   onClick={() => _onDeleteImg(item)}
                      style={{ color: "red" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            ຍົກເລີກ
          </Button>
          <Button variant='success' onClick={handleClose}>
            ບັນທືກ
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
