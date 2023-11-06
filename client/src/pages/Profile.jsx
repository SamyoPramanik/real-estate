import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../userContext";

export default function Profile() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        setFileError(null);
        const formData = new FormData();
        formData.set("avatar", file);
        try {
            setSuccess("Uploading profile picture...");
            fetch("/api/user/update-avatar", {
                method: "POST",
                body: formData,
            }).then((res) => {
                res.json().then((data) => {
                    if (data.success === false) {
                        setFileError(data.message);
                        setSuccess(null);
                    } else {
                        setFileError(null);
                        const avatar = "/api/avatars/" + data.filename;
                        setUserInfo({ ...userInfo, avatar });
                        setSuccess("Profile picture updated successfully");
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }, [file]);

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4">
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
                />
                <input
                    type="text"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                    id="email"
                />
                <input
                    type="text"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                    id="password"
                />
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                    update
                </button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer">
                    Delete Account
                </span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
        </div>
    );
}
