import {Navigate, Route, useNavigate} from "react-router-dom";
import LayoutPage from "../Components/layout";
import {baseUrl, saveCustomizedNewsfeedUrl} from "./constant";
import axios from "axios";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      CheckToken() ? (
        <LayoutPage>
          <Component {...props} />
        </LayoutPage>
      ) : (
        <Navigate to="/login" />
      )
    }
  />
);

export const CheckToken = () => {
  var token = getToken();
  if (token) {
    return true;
  }
  return false;
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};
export const getAuthUser = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};