const themeName = process.env.REACT_APP_THEME || "default";

const theme = require(`./themes/${themeName}.js`).default;

export default theme;
