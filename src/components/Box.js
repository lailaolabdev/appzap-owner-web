import styled from "styled-components";
const Box = styled("div")(({ sx, theme }) => {
  if (!sx) {
    return {};
  }
  const { xl, lg, md, sm, xs } = sx;
  let _xl = {};
  let _lg = {};
  let _md = {};
  let _sm = {};
  let _xs = {};
  for (const _item in sx) {
    if (typeof sx[_item] === "object" || sx[_item] !== "children") {
      for (const _i in sx[_item]) {
        if (_i === "xl") {
          _xl[_item] = sx[_item][_i];
        }
        if (_i === "lg") {
          _lg[_item] = sx[_item][_i];
        }
        if (_i === "md") {
          _md[_item] = sx[_item][_i];
        }
        if (_i === "sm") {
          _sm[_item] = sx[_item][_i];
        }
        if (_i === "xs") {
          _xs[_item] = sx[_item][_i];
        }
      }
    }
  }
  return {
    [theme?.xs]: {
      ...xs,
      ..._xs,
    },
    [theme?.sm]: {
      ...sm,
      ..._sm,
    },
    [theme?.md]: {
      ...md,
      ..._md,
    },
    [theme?.lg]: {
      ...lg,
      ..._lg,
    },
    [theme?.xl]: {
      ...xl,
      ..._xl,
    },
    ...sx,
  };
});

export default Box;
