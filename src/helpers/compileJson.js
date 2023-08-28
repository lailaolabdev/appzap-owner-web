function compileJson(json) {
  const data = JSON.stringify(json, function (key, value) {
    return typeof value === "function"
      ? { isFunction: true, func: value.toString() }
      : value;
  });
  return data;
}

export default compileJson;
