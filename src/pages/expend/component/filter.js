import React, { useState, useEffect } from "react";

/**
 * component
 */
/**
 * css
 */

import { Container, Row, Col } from "react-bootstrap";

export default function Filter({filterByYear, setFilterByYear,filterByMonth, setFilterByMonth}) {
  const [years, setYears] = useState([]);
 
  useEffect(() => {
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;

    const yearArray = Array.from({ length: 10 }, (_, index) => 2023 + index);
    setYears(yearArray);
    // setFilterByYear(currentYear)
    // setFilterByMonth(currentMonth)
  }, []);

  return (
    <div>
      <Container fluid className="mt-3 p-0">
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
            ສະແດງຕາມປີ
          </Col>
          <Col xs={12} sm={9} md={10} className="showFromMonth">
            {years.map((item, index) => (
              <div key={index} onClick={()=> setFilterByYear(item)} className={item === filterByYear ? 'active' : ""}>{item}</div>
            ))}
          </Col>
        </Row>

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
            ສະແດງຕາມເດືອນ
          </Col>
          <Col xs={12} sm={9} md={10} className="showFromMonth">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
              <div key={index} onClick={()=> setFilterByMonth(item)} className={item === filterByMonth ? 'active' : ""}>{item}</div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
