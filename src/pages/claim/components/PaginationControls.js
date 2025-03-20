import React from "react";
import ReactPaginate from "react-paginate";
import { Pagination } from "react-bootstrap";

const PaginationControls = ({ pageCount, onPageChange, t }) => (
  <ReactPaginate
    previousLabel={
      <span className="glyphicon glyphicon-chevron-left">{t("previous")}</span>
    }
    nextLabel={
      <span className="glyphicon glyphicon-chevron-right">{t("next")}</span>
    }
    breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
    breakClassName={"break-me"}
    pageCount={pageCount || 1}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={onPageChange}
    containerClassName={"pagination justify-content-center"}
    pageClassName={"page-item"}
    pageLinkClassName={"page-link"}
    activeClassName={"active"}
    previousClassName={"page-item"}
    nextClassName={"page-item"}
    previousLinkClassName={"page-link"}
    nextLinkClassName={"page-link"}
  />
);

export default PaginationControls;
