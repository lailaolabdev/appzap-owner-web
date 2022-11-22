import styled from "styled-components";

const Table = styled("table")({
  width: "100%",
  "thead, tbody": {
    ">*": {
      border: "1px solid #ccc",
    },
  },
});

export default Table;
