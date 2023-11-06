import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setFileError(null);
        const avatarData = new FormData();
        avatarData.set("avatar", file);
        try {
            setSuccess("Uploading profile picture...");
            fetch("/api/user/update-avatar", {
                method: "POST",
                body: avatarData,
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success === false) {
                        setFileError(data.message);
                        setSuccess(null);
                    } else {
                        setFileError(null);
                        const avatar = "/api/avatars/" + data.filename;
                        setUserInfo({ ...userInfo, avatar });
                        setFormData({ ...formData, avatar });

                        setSuccess("Profile picture updated successfully");
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }, [file]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const updateuser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        console.log(formData);
        try {
            const res = await fetch("/api/user/update", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            console.log(data);
            if (data.success == false) {
                setError(data.message);
                setLoading(false);
            } else {
                setError("User updated successfully");
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setError(err);
        }
    };

    const deleteUser = async (e) => {
        try {
            const res = await fetch("/api/user/delete", {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success == false) setError(data.message);
            else {
                setUserInfo(null);
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={updateuser}>
                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/.*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={userInfo.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                {fileError && (
                    <p className="text-red-700 text-sm self-center">
                        {fileError}
                    </p>
                )}
                {success && (
                    <p className="text-green-700 text-sm self-center">
                        {success}
                    </p>
                )}
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-3 rounded-lg"
                    id="username"
                    defaultValue={userInfo.username}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                    id="email"
                    defaultValue={userInfo.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    disabled={loading}
                >
                    {loading ? `updating...` : `update`}
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    className="text-red-700 cursor-pointer"
                    onClick={deleteUser}
                >
                    Delete Account
                </span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
            {error && <p className="text-red-700 mt-5">{error}</p>}
        </div>
    );
}
