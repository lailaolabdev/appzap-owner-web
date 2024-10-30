import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * component
 */
/**
 * css
 */

import { Container, Row, Col, Form } from "react-bootstrap";

export default function Filter({
  filterByYear,
  setFilterByYear,
  filterByMonth,
  setFilterByMonth,
  setDateStart,
  setDateEnd,
}) {
  const { t } = useTranslation();
  const [years, setYears] = useState([]);

  useEffect(() => {
    const yearArray = Array.from({ length: 10 }, (_, index) => 2023 + index);
    setYears(yearArray);
  }, []);

  return (
    <div>
      <Container fluid className="mt-3 p-0">
        {/* <Row>
          <Col
            xs={12}
            sm={3}
            md={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ສະແດງຕາມປີ
          </Col>
          <Col xs={12} sm={9} md={10} className="showFromMonth">
            {years.map((item, index) => (
              <div key={index} onClick={()=> setFilterByYear(item)} className={item === filterByYear ? 'active' : ""}>{item}</div>
            ))}
          </Col>
        </Row> */}

        <Row>
          <Col
            xs={12}
            sm={3}
            md={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {t("year")} <div style={{ width: 10 }}></div>{" "}
            <Form.Control
              as="select"
              name="year"
              value={filterByYear}
              onChange={(e) => {
                setFilterByYear(e.target.value);
              }}
              style={{ width: 100 }}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </Form.Control>
            <div style={{ width: 10 }}></div>
            {t("month")}
          </Col>

          <Col xs={12} sm={9} md={10} className="showFromMonth">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilterByMonth(item);
                  setDateStart("");
                  setDateEnd("");
                }}
                className={item === filterByMonth ? "active" : ""}
              >
                {item}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
