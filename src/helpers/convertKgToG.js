export const convertkgToG = (kg) => {
  if (typeof kg !== "number" || Number.isNaN(kg)) {
    return "Invalid input: Please enter a valid number.";
  }

  const grams = kg * 0.1;

  const result = Math.round(grams * 10) / 10;

  return result;
};
