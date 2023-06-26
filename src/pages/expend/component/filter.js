import React from "react";

/**
 * component
 */
/**
 * css
 */

import { Container, Row, Col, Form } from "react-bootstrap";

export default function Filter() {

  return (
    <div>
      <Container fluid className="mt-3 p-0">
        <Row className='p-0'>
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-3" controlId="formPlaintextEmail">
              <Form.Label>ປະເພດຮັບ-ຈ່າຍ</Form.Label>
              <Form.Control type="text" placeholder="ຄົ້ນຫາຕາມເລກບິນ" />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-3" controlId="formPlaintextEmail">
              <Form.Label>ເລກບິນ</Form.Label>
              <Form.Control type="text" placeholder="ຄົ້ນຫາຕາມເລກບິນ" />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-3" controlId="formPlaintextEmail">
              <Form.Label>ບັນຊີທຸລະກຳ</Form.Label>
              <Form.Control type="text" placeholder="ຄົ້ນຫາຕາມເລກບິນ" />
            </Form.Group>
          </Col>
       </Row>  
       <Row>
         
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-3" controlId="formPlaintextEmail">
              <Form.Label>ວັນທີເລີ່ມຕົ້ນ</Form.Label>
              <Form.Control type="date" placeholder="ຄົ້ນຫາຕາມເລກບິນ" />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Form.Group className="mb-3" controlId="formPlaintextEmail">
              <Form.Label>ວັນທີສຸດທ້າຍ</Form.Label>
              <Form.Control type="date" placeholder="ຄົ້ນຫາຕາມເລກບິນ" />
            </Form.Group>
          </Col>

        </Row>
      </Container>
    </div>
  );
}
