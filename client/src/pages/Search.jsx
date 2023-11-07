import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc",
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setLoading(true);

        const searchTermUrl = urlParams.get("searchTerm");
        const typeUrl = urlParams.get("type");
        const parkingUrl = urlParams.get("parking");
        const furnishedUrl = urlParams.get("furnished");
        const offerUrl = urlParams.get("offer");
        const sortUrl = urlParams.get("sort");
        const orderUrl = urlParams.get("order");

        if (
            searchTermUrl ||
            typeUrl ||
            parkingUrl ||
            furnishedUrl ||
            offerUrl ||
            sortUrl ||
            orderUrl
        ) {
            setSidebarData({
                searchTerm: searchTermUrl || "",
                type: typeUrl || "all",
                parking: parkingUrl === "true" || false,
                furnished: furnishedUrl === "true" || false,
                offer: offerUrl === "true" || false,
                sort: sortUrl || "createdAt",
                order: orderUrl || "desc",
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) setShowMore(true);
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("start", startIndex);
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    const handleChange = (e) => {
        if (
            e.target.id === "all" ||
            e.target.id === "rent" ||
            e.target.id === "sale"
        )
            setSidebarData({ ...sidebarData, type: e.target.id });

        if (e.target.id === "searchTerm")
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        )
            setSidebarData({
                ...sidebarData,
                [e.target.id]:
                    e.target.checked || e.target.checked === "true"
                        ? true
                        : false,
            });

        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "createdAt";
            const order = e.target.value.split("_")[1] || "desc";

            setSidebarData({ ...sidebarData, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        const keys = Object.keys(sidebarData);
        keys.map((key) => urlParams.set(key, sidebarData[key]));
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <div className="flex flex-col md:flex-row ">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term:
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-5 flex-wrap">
                        <label className="whitespace-nowrap font-semibold">
                            Type:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                                checked={sidebarData.type === "all"}
                                onChange={handleChange}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                checked={sidebarData.type === "rent"}
                                onChange={handleChange}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                checked={sidebarData.type === "sale"}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                checked={sidebarData.offer}
                                onChange={handleChange}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 flex-wrap">
                        <label className="whitespace-nowrap font-semibold">
                            Amenities:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                checked={sidebarData.parking}
                                onChange={handleChange}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                checked={sidebarData.furnished}
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <select
                            id="sort_order"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                            defaultValue="createdAt_desc"
                        >
                            <option value="regularPrice_desc">
                                Price high to low
                            </option>
                            <option value="regularPrice_asc">
                                Price low to high
                            </option>
                            <option value="createdAt_desc"> Latest</option>
                            <option value="createdAt_asc">Oldest</option>s
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                        Search
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
                    Listing results
                </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700 ">
                            No Listing found
                        </p>
                    )}
                    {loading && (
                        <p className="text-xl text-slate-700 text-center w-full">
                            Loading...
                        </p>
                    )}
                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className="text-green-700 hover:underline p-7 text-center w-full"
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
