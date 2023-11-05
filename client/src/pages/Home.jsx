import React, { useEffect, useContext } from "react";
import { UserContext } from "../userContext.jsx";
export default function Home() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        console.log(userInfo);
    }, []);
    return <div>Home</div>;
}
