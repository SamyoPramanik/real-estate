import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                console.log(`userRef: ${listing.userRef}`);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                console.log(`userid: ${data._id}`);

                setLandlord(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchLandlord();
    }, []);
    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact{" "}
                        <span className="font-semibold">
                            {landlord.username}
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold">
                            {listing.name.toLowerCase()}
                        </span>{" "}
                        in{" "}
                        <span className="font-semibold">{listing.address}</span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here..."
                        className="w-full border p-3 rounded-lg"
                    ></textarea>
                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className="bg-slate-700 text-center p-3 uppercase text-white rounded-lg hover:opacity-95 w-full"
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}
