const matchRoundNumber = (number) => {
  // return Math.round(number / 1000) * 1000;
  return Math.ceil(number / 1000) * 1000;
  // return Math.floor(number);
};
export default matchRoundNumber;
