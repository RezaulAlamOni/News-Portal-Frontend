import { Route, Navigate } from "react-router-dom";
import LayoutPage from "../Components/layout";

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
  return localStorage.getItem("user") || null;
};
