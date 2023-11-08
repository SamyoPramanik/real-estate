import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [file, setFile] = useState(undefined);
    const [fileError, setFileError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filePerc, setFilePerc] = useState(0);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showListingError, setShowListingError] = useState(null);
    const [listings, setListings] = useState([]);
    const fileRef = useRef(null);
    const navigate = useNavigate();
    console.log(formData);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (err) => {
                setFileError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    // useEffect(() => {
    //     setFileError(null);
    //     const avatarData = new FormData();
    //     avatarData.set("avatar", file);
    //     try {
    //         setSuccess("Uploading profile picture...");
    //         fetch("/api/user/update-avatar", {
    //             method: "POST",
    //             body: avatarData,
    //         }).then((res) => {
    //             res.json().then((data) => {
    //                 if (data.success === false) {
    //                     setFileError(data.message);
    //                     setSuccess(null);
    //                 } else {
    //                     setFileError(null);
    //                     const avatar = "/api/uploads/" + data.filename;
    //                     setUserInfo({ ...userInfo, avatar });
    //                     setFormData({ ...formData, avatar });

    //                     setSuccess("Profile picture updated successfully");
    //                 }
    //             });
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }, [file]);

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
                setUserInfo(data);
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

    const handleSignOut = async (e) => {
        try {
            await fetch("/api/auth/signout");
            setUserInfo(null);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const showListing = async (e) => {
        try {
            setShowListingError(null);
            const res = await fetch("/api/user/listings");
            const data = await res.json();
            setListings(data);
            console.log(data);
        } catch (err) {
            setShowListingError(err.message);
        }
    };

    const handleDeleteListing = async (listingId) => {
        try {
            setShowListingError(null);
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) setShowListingError(data.message);
            else {
                setShowListingError("Listing deleted");
                setListings((listings) =>
                    listings.filter((listing) => listing._id != listingId)
                );
            }
        } catch (err) {
            setShowListingError(err.message);
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
                    src={formData.avatar || userInfo.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                {fileError ? (
                    <p className="text-red-700 text-sm self-center">
                        Error Image upload
                    </p>
                ) : filePerc > 0 && filePerc < 100 ? (
                    <p className="text-black text-sm self-center">{`Uploading ${filePerc}%`}</p>
                ) : filePerc === 100 ? (
                    <p className="text-green-700 text-sm self-center">
                        Image successfully uploaded
                    </p>
                ) : (
                    ""
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
                <Link
                    to={"/create-listing"}
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                >
                    create listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    className="text-red-700 cursor-pointer"
                    onClick={deleteUser}
                >
                    Delete Account
                </span>
                <span
                    className="text-red-700 cursor-pointer"
                    onClick={handleSignOut}
                >
                    Sign Out
                </span>
            </div>
            {error && <p className="text-red-700 mt-5">{error}</p>}
            <button
                onClick={showListing}
                type="button"
                className="text-green-700 w-full"
            >
                Show Listing
            </button>
            {showListingError && (
                <p className="text-red-700 mt-5">{showListingError}</p>
            )}
            {listings && listings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 font-semibold text-2xl">
                        Your listings
                    </h1>
                    {listings.map((listing) => (
                        <div
                            key={listing._id}
                            className="border rounded-lg p-3 flex justify-between items-center gap-4"
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt="listing-cover"
                                    className="h-16 w-16 object-contain"
                                />
                            </Link>
                            <Link
                                className="flex-1"
                                to={`/listing/${listing._id}`}
                            >
                                <p className="text-slate-700 font-semibold hover:underline truncate">
                                    {listing.name}
                                </p>
                            </Link>
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() =>
                                        handleDeleteListing(listing._id)
                                    }
                                    className="text-red-700 uppercase"
                                >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className="text-green-700 uppercase">
                                        Edit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
