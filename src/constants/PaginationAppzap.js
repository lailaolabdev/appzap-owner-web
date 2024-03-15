import React from 'react'
import { Pagination, Row, Col } from "react-bootstrap";

export default function PaginationAppzap({
  count = 0,
  page,
  rowsPerPage,
  pageAll,
  onPageChange,
}) {
  // const pagesToDisplay = 10; // Number of pages to display around the current page
  const halfPagesToDisplay = Math.floor(rowsPerPage / 2);

  console.log("page:--->", pageAll, page)

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (pageAll <= rowsPerPage) {
      for (let i = 0; i < pageAll; i++) {
        pageNumbers.push(i);
      }
    } else if (page < halfPagesToDisplay) {
      for (let i = 0; i < rowsPerPage; i++) {
        pageNumbers.push(i);
      }
    } else if (page >= pageAll - halfPagesToDisplay) {
      for (let i = pageAll - rowsPerPage; i < pageAll; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = page - halfPagesToDisplay; i <= page + halfPagesToDisplay; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <Row> 
      <Col xs={12} style={{ display: "flex", justifyContent: "center", }}>
        <Pagination>
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          />
          {getPageNumbers().map((pageNumber) => (
            <Pagination.Item
              active={pageNumber === page}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}>
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === pageAll - 1}
            onClick={() => onPageChange(page + 1)}
          />
           
        </Pagination>
      </Col>
    </Row>
  );
}
