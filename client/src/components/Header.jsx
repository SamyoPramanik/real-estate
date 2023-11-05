import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { useContext, useEffect } from "react";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    useEffect(() => {
        console.log(`data:${userInfo.username}`);
    }, []);

    return (
        <header className="bg-slate-200 shadow-sm">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Real</span>
                        <span className="text-slate-700">World</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                    />
                    <FaSearch className="text-slate-700" />
                </form>
                <ul className="flex gap-4">
                    <Link to="/">
                        <li className="hidden sm:inline hover:underline">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline hover:underline">
                            About
                        </li>
                    </Link>
                    {userInfo.username ? (
                        <Link to="/profile">
                            <li className="hidden sm:inline hover:underline">
                                <img
                                    className="rounded-full h-7 w-7 object-cover"
                                    src={userInfo.avatar}
                                />
                            </li>
                        </Link>
                    ) : (
                        <Link to="/sign-in">
                            <li className="sm:inline hover:underline">
                                Sign In
                            </li>
                        </Link>
                    )}
                </ul>
            </div>
        </header>
    );
}
