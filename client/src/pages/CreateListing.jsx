import React, { useState } from "react";

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [fileUrls, setFileUrls] = useState([]);
    const [uploading, setUploading] = useState(false);

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

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Crate a Listing
            </h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength="62"
                        minLength="10"
                        required
                    />
                    <textarea
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                    />
                    <div className="flex flex-wrap gap-6">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" />
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
                            />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                required
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="discountPrice"
                                required
                            />
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>{" "}
                        </div>
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
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    );
}
