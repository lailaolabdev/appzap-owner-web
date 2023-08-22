const testFunc = () => {
  alert("test Funn");
};
const converData = (value, defualtAppZap) => {
  if (typeof value === "object" && value !== null) {
    if (value.isJS) {
      if (value.isVar) {
        // console.log("value", value);
        console.log("defualtAppZap", defualtAppZap);
        const _var = defualtAppZap?.item?.name;
        console.log("_var", _var);
        return `${_var}`;
      } else {
        return eval(value.__key);
      }
    } else if (value.isJSArray) {
      const _array = eval(value.__array);
      const _mapData = _array.map((item, index) => {
        const _compi_item = compileJson(item);
        const _res = deCompileJson(_compi_item, defualtAppZap);
        return _res;
      });

      const _compi = _array.map((item, index) => {
        const _item = compileJson(value.__item);
        const _rep_item = _item.replace("[[item.menu]]", `${item.name}`);
        const _deC_item = deCompileJson(_rep_item);
        // console.log("item", item);
        // console.log("data", data);
        return _deC_item;
      });

      // console.log("_compi", _compi);
      return _compi;
    } else {
      return value;
    }
  } else {
    return value;
  }
};

function compileJson(json) {
  const data = JSON.stringify(json, function (key, value) {
    return typeof value === "function"
      ? { isJS: true, __key: value.toString() }
      : value;
  });
  return data;
}

function deCompileJson(json, defualtAppZap) {
  const data = JSON.parse(json, function (key, value) {
    // console.log("deCompileJson-defualtAppZap", defualtAppZap);
    return converData(value, defualtAppZap);
  });
  return data;
}

export default deCompileJson;
