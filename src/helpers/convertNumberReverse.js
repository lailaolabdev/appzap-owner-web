const convertNumberReverse = (value, callback) => {
    const inputValue = value.replace(/,/g, "");
    if (!value.charAt(0).match(/[0-9]/)) {
      callback("");
    } else if (!isNaN(inputValue)) {
      callback(inputValue);
    }
  };
  
  export default convertNumberReverse;