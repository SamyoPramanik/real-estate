import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from "react-icons/fa";
import { UserContext } from "../UserContext";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.id}`);
                const data = await res.json();
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    return;
                }
                setListing(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(false);
                setLoading(false);
            }
        };

        fetchListing();
    }, []);
    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
            {error && (
                <p className="text-center my-7 text-2xl">
                    Something error wrong
                </p>
            )}

            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-slate-500"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                            Link copied!
                        </p>
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        <p className="text-2xl font-semibold">
                            {listing.name} - ${" "}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString("en-US")
                                : listing.regularPrice.toLocaleString("en-US")}
                            {listing.type === "rent" && "/month"}
                        </p>
                        <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
                            <FaMapMarkerAlt className="text-green-700" />
                            {listing.address}
                        </p>
                        <div className="flex gap-4">
                            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-2 rounded-md">
                                {listing.type === "rent"
                                    ? "For Rent"
                                    : "For Sale"}
                            </p>
                            {listing.offer ? (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md">
                                    $
                                    {+listing.regularPrice -
                                        +listing.discountPrice}{" "}
                                    discount
                                </p>
                            ) : (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md">
                                    ${+listing.regularPrice}
                                </p>
                            )}
                        </div>
                        <p className="text-slate-800">
                            <span className="font-semibold text-black">
                                Description -{" "}
                            </span>
                            {listing.description}
                        </p>
                        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-8">
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaBed className="text-lg" />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : `${listing.bedrooms} Bed`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaBath className="text-lg" />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths`
                                    : `${listing.bathrooms} Bath`}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaParking className="text-lg" />
                                {listing.parking
                                    ? "Parking spot"
                                    : "No Parking"}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap ">
                                <FaChair className="text-lg" />
                                {listing.furnished ? "Furnished" : "Unfrnished"}
                            </li>
                        </ul>
                        {!contact &&
                            userInfo._id &&
                            userInfo._id !== listing.userRef && (
                                <button
                                    onClick={() => setContact(true)}
                                    className="bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 p-3"
                                >
                                    Contact landlord
                                </button>
                            )}
                        {userInfo._id && userInfo._id === listing.userRef && (
                            <Link
                                className="bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 p-3 text-center"
                                to={`/update-listing/${listing._id}`}
                            >
                                Update Listing
                            </Link>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    );
}
