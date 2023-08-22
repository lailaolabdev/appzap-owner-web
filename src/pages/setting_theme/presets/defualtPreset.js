const menu = {
  type: "div",
  props: {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 10,
      gridGap: 10,
    },
    children: {
      isJSArray: true,
      __array: "defualtAppZap?.menus",
      __item: {
        type: "div",
        props: {
          onClick: {
            isJS: true,
            __key: "testFunc",
          },
          style: {
            width: "100%",
            background: "#930",
            border: "1px solid #ccc",
            borderRadius: 4,
            overflow: "hidden",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  width: "100%",
                  height: 60,
                  backgroundColor: "#909090",
                },
                children: "",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  width: "100%",
                  height: 20,
                  backgroundColor: "#ffffff",
                },
                children: "[[item.menu]]",
              },
            },
          ],
        },
      },
    },
  },
};

const defualtPreset = {
  type: "div",
  props: {
    style: {
      height: "100dvh",
    },
    children: [
      {
        type: "div",
        props: {
          onClick: () => alert("Okk"),
          style: {
            width: "100%",
            background: "#930",
          },
          align: "center",
          children: { type: "blink", props: { children: "Hello" } },
        },
      },
      menu,
    ],
  },
};
export default defualtPreset;
