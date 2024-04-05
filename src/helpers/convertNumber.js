const convertNumber = (number) => {
    if (number === null) {
      return "";
    }
    if (number === undefined) {
      return "";
    }
    if (number === NaN) {
      return "";
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  export default convertNumber;