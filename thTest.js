const obj = {
  key: "test",
  nuber: 934,
  test: {
    onClick: () => alert("testdd"),
  },
};
console.log(obj);
const data = JSON.stringify(obj, function (key, value) {
  return typeof value === "function"
    ? { isFunction: true, func: value.toString() }
    : value;
});

console.log(data);

const hhh = JSON.parse(data, function (key, value) {
  // if(typeof value != 'string') return value;
  if (typeof value === "object" && value !== null) {
    if (value.isFunction) {
      return eval(value.func);
    } else {
      return value;
    }
  } else {
    return value;
  }

  return value.substring(0, 8) == "function" ? eval("(" + value + ")") : value;
});

console.log(hhh);

const data2 = JSON.stringify(hhh, function (key, value) {
  return typeof value === "function"
    ? { isFunction: true, func: value.toString() }
    : value;
});

console.log(data2);
