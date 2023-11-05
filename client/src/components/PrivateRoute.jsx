import React, { useContext } from "react";
import { UserContext } from "../userContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    return userInfo.username ? <Outlet /> : <Navigate to="/sign-in" />;
}
