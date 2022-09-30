import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Cookies from "universal-cookie";
import { Impresion } from "../Admin/Views/Venta";
import { AdminRoute } from "./Admin/AdminRoute";
import { ClientRoute } from "./Client/ClientRoute";

export const Routes = () => {
  const cookies = new Cookies();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin" component={AdminRoute} />
        {cookies.get("token") && (
          <Route exact path="/impresion/:item/:id">
            <Impresion />
          </Route>
        )}
        <ClientRoute />
      </Switch>
    </BrowserRouter>
  );
};
