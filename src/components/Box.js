import styled from "styled-components";
const Box = styled("div")(({ sx, theme }) => {
  const { xl, lg, md, sm, xs } = sx;
  let _xl = {};
  let _lg = {};
  let _md = {};
  let _sm = {};
  let _xs = {};
  for (const _item in sx) {
    if (typeof sx[_item] === "object") {
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
        if (_i === "xs") {
          _xs[_item] = sx[_item][_i];
        }
      }
    }
  }
  return {
    [theme.xl]: {
      ...xl,
      ..._xl,
    },
    [theme.lg]: {
      ...lg,
      ..._lg,
    },
    [theme.md]: {
      ...md,
      ..._md,
    },
    [theme.sm]: {
      ...sm,
      ..._sm,
    },
    [theme.xs]: {
      ...xs,
      ..._xs,
    },
    ...sx,
  };
});
export default Box;
