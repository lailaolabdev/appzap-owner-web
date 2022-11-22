import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// page
import MenuList from "../pages/menu_and_stock/List";

export default function MenuRoutes() {
  return (
    <>
      <Route
        exact
        path="/menu-new"
        render={(e) => {
          return <MenuList />;
        }}
      />
    </>
  );
}
