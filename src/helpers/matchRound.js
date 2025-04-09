const matchRoundNumber = (number) => {
  //   return Math.round(number / 1000) * 1000;
  return Math.ceil(number / 500) * 500;
};
export default matchRoundNumber;
