import { END_POINT_SEVER } from './api'
export const USER_KEY = "@userKey";
export const URL_PHOTO_AW3 = "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/resized/small/"
// export const END_POINT = END_POINT_SEVER;
export const END_POINT = END_POINT_SEVER;
export const FONT_HEADER_SIZE = 16;
export const BUTTON_INDEX = 100;
export const PRIMARY_FONT_BLACK = { fontColor: "black", fontWeight: "bold" };
export const CANCEL_STATUS = "CANCELED";
export const DOING_STATUS = "DOING";
export const WAITING_STATUS = "WAITING";
export const SERVE_STATUS = "SERVED";
export const CART_STATUS = "CART";
export const ACTIVE_STATUS = "ACTIVE";
export const CALLTOCHECKOUT_STATUS = "CALLTOCHECKOUT";
export const NOT_STATUS = "NOT";
export const CHECKOUT_STATUS = "CHECKOUT";
export const ALL_STATUS = [
    { value: "DOING", label: "ກໍາລັງຄົວ" },
    { value: "SERVED", label: "	ເສີບແລ້ວ" },
];
export const COLOR_APP = "#FB6E3B"
export const COLOR_APP_CANCEL = "red"
export const TITLE_HEADER = {
    paddingLeft: 55,
    paddingTop: 20,
    backgroundColor: "#F9F9F9",
    width: "100%",
};

export const HEADER = {
    color: "#5C5C5C",
    backgroundColor: "#F9F9F9",
    height: 60,
    width: "100%",
    paddingTop: 20,
    // paddingLeft: 35,
    fontSize: FONT_HEADER_SIZE,
};
export const BODY = {
    width: "100%",
    minHeight: "200vh",
    backgroundColor: "white",
    // marginRight: 32,
    // marginLeft: 32,
    // paddingLeft: 32,
    // paddingTop: 32,
    // paddingRight: 32,
    // paddingBottom: 40,
};

export const DIV_NAV = {
    // paddingLeft: 32,
};

export const table_container_blue = {
    width: 200,
    height: 70,
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: "#FFF",
    borderWidth: "bold",
    borderColor: "black",
    cursor: "pointer",
};
export const table_container = {
    width: 200,
    height: 100,
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: "#2372A3",
    cursor: "pointer",
};

export const table_style_center = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
};
export const BUTTON_OUTLINE_PRIMARY = "outline-primary";
export const BUTTON_OUTLINE_DARK = "outline-dark";
export const BUTTON_OUTLINE_DANGER = "outline-danger";
export const BUTTON_DANGER = "danger";
export const BUTTON_OUTLINE_BLUE = "outline-primary";
export const padding = { padding: 10, backgroundColor: "#F1F1F1" };
export const padding_white = { padding: 10, backgroundColor: "#FFF" };
export const font_text = { color: "#FFF", fontSize: 20 };
export const font_text_black = {
    color: "#0D0D0D",
    fontSize: 20,
    paddingTop: 10,
};
export const half_backgroundColor = {
    width: "40%",
    backgroundColor: "#fff",
    border: 1,
    height: "90vh",
    overflowY: "scroll",
};
export const font_description_text = { color: "#FFF", fontSize: 15 };
export const BUTTON_EDIT = {
    zPosition: 100,
    width: BUTTON_INDEX,

};
export const BUTTON_EDIT_HOVER = {
    backgroundColor: '#FB6E3B',
    zPosition: 100,
    border: "0px solid #FB6E3B",
    width: BUTTON_INDEX,

};

export const BUTTON_DELETE = {
    zPosition: 100,
    width: BUTTON_INDEX,
    border: "none"
};

export const BUTTON_SUCCESS = {
    zPosition: 100,
    width: BUTTON_INDEX,
};