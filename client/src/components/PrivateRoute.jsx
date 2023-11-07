import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function PrivateRoute() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [isReady, setIsReady] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/api/user/info").then((res) =>
            res.json().then((data) => {
                setUserInfo(data);
                setIsReady(true);
            })
        );
        console.log(`data:${userInfo.username}`);
    }, []);
    return (
        isReady && (userInfo.username ? <Outlet /> : <Navigate to="/sign-in" />)
    );
    return <Outlet />;
}
