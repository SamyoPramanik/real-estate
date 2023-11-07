import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/api/user/info").then((res) =>
            res.json().then((data) => setUserInfo(data))
        );
        console.log(`data:${userInfo.username}`);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get("searchTerm");
        setSearchTerm(searchTerm);
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
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-100 p-3 rounded-lg flex items-center"
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className="text-slate-700" />
                    </button>
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
                    {userInfo?.username ? (
                        <Link to="/profile">
                            <li className="sm:inline hover:underline">
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
