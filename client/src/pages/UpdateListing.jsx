import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [fileUrls, setFileUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        parking: false,
        furnished: false,
        offer: false,
        discountPrice: 0,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const params = useParams();

    useEffect(() => {
        setFormData({ ...formData, imageUrls: fileUrls });
    }, [fileUrls]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingId = params.id;
                console.log(listingId);
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message);
                } else {
                    setFormData(data);
                    setFileUrls(data.imageUrls);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchListing();
    }, []);

    const handleImageSubmit = async (e) => {
        try {
            setUploading(true);
            setImageUploadError(null);
            console.log(files.length, fileUrls.length);
            if (files.length > 0 && fileUrls.length + files.length < 7) {
                for (let i = 0; i < files.length; i++) {
                    let fileUrl = await storeImage(files[i]);
                    if (fileUrl != "error") {
                        fileUrl = `/api/uploads/${fileUrl}`;
                        setFileUrls((files) => [...files, fileUrl]);
                    } else {
                        setImageUploadError("Image uploading failed");
                    }
                }
                setFiles([]);
                setUploading(false);
            } else {
                setImageUploadError("You can only upload 6 images per listing");
                setUploading(false);
            }
        } catch (err) {
            setImageUploadError("Image uploading failed");
        }
    };

    const handleDeleteImage = (e) => {
        setFileUrls(fileUrls.filter((item) => item != e.target.id));
    };

    const storeImage = async (file) => {
        let imageData = new FormData();
        imageData.set("images", file);
        console.log(imageData);
        const res = await fetch("/api/user/uploadImages", {
            method: "POST",
            body: imageData,
        });
        const data = await res.json();
        console.log(data);
        if (data.success) return data.filename;
        else return "error";
    };
    console.log(formData);

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({ ...formData, type: e.target.id });
        }

        if (
            e.target.id === "parking" ||
            e.target.id === "furnished" ||
            e.target.id === "offer"
        ) {
            setFormData({ ...formData, [e.target.id]: e.target.checked });
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({ ...formData, [e.target.id]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormData({ ...formData, imageUrls: fileUrls });
        if (formData.imageUrls.length < 1)
            return setError("You must upload at least one image");
        if (formData.offer && +formData.regularPrice < +formData.discountPrice)
            return setError("Discount price must be lower than regular price");
        try {
            setLoading(true);
            setError(null);
            const listingId = params.id;

            const res = await fetch(`/api/listing/update/${listingId}`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) setError(data.message);
            else navigate(`/listing/${data._id}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Update a Listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength="62"
                        minLength="1"
                        required
                        value={formData?.name}
                        onChange={handleChange}
                    />
                    <textarea
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                        value={formData?.description}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                        value={formData?.address}
                        onChange={handleChange}
                    />
                    <div className="flex flex-wrap gap-6">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                checked={formData?.type === "sale"}
                                onChange={handleChange}
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                checked={formData?.type === "rent"}
                                onChange={handleChange}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                checked={formData?.parking}
                                onChange={handleChange}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                checked={formData?.furnished}
                                onChange={handleChange}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                checked={formData?.offer}
                                onChange={handleChange}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                required
                                value={formData?.bedrooms}
                                onChange={handleChange}
                            />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bathrooms"
                                min="1"
                                max="10"
                                required
                                value={formData?.bathrooms}
                                onChange={handleChange}
                            />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                required
                                value={formData?.regularPrice}
                                onChange={handleChange}
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                {formData.type === "rent" && (
                                    <span className="text-xs">($ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    className="p-3 border border-gray-300 rounded-lg"
                                    type="number"
                                    id="discountPrice"
                                    required
                                    value={formData?.discountPrice}
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discounted Price</p>
                                    {formData.type === "rent" && (
                                        <span className="text-xs">
                                            ($ / month)
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The image will be the cover (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="images/*"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                        <button
                            onClick={handleImageSubmit}
                            type="button"
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                            disabled={uploading}
                        >
                            {uploading ? `Uploading...` : `Upload`}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>
                    {fileUrls.length > 0
                        ? fileUrls.map((file) => (
                              <div
                                  key={file}
                                  className="flex items-center justify-between p-3"
                              >
                                  <img
                                      src={file}
                                      className="w-20 h-20 object-contain rounded-lg"
                                  />
                                  <button
                                      type="button"
                                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                                      id={file}
                                      onClick={handleDeleteImage}
                                  >
                                      delete
                                  </button>
                              </div>
                          ))
                        : ``}
                    <button
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                        disabled={loading}
                    >
                        {loading ? `updating...` : `update Listing`}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}
