import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

const PaginationComponent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [_limit, set_limit] = useState(parseInt(params?.limit));
  const [_skip, set_skip] = useState(parseInt(params?.skip));

  const Pagination_component= (total, rout, filtter) => {
    const handlePageClick = async (envent) => {
      let currentPage = envent.selected + 1;
     await navigate(rout + "/limit/" + _limit + "/skip/" + currentPage,filtter);
    };
    return (
      <ReactPaginate
        previousLabel="ກັບຄືນ"
        onPageChange={handlePageClick}
        breakLabel="..."
        pageRangeDisplayed={5}
        pageCount={Math.ceil(total / _limit)}
        // pageRangeDisplayed={7}
        marginPagesDisplayed={3}
        renderOnZeroPageCount={null}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        forcePage={_skip - 1}
        nextLabel="ຕໍ່ໄປ"
      />
    );
  };
  return {
    set_limit,
    set_skip,
    _limit,
    _skip,
    Pagination_component
  };
};
export default PaginationComponent;
