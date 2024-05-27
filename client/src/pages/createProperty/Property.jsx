import "./property.scss";
import { useState } from "react";
import { app } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";

const Property = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [files, serFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    college: 1,
    hospitals: 1,
    contactNumber: 123,
    sellerEmail: "",

    price: 50,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleImageDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "email" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("upload one image atleast");
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userData: currentUser._id,
        }),
      });
      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      // navigate(`/listing/${data._id}`);
      navigate(`/singleProperty/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="property_section">
      {imageUploadError && imageUploadError}

      <div className="main_property_div">
        <div className="property_form_div">
          <h1>Create property</h1>

          <form className="property_form" action="" onSubmit={handleSubmit}>
            <div className="property_one_div">
              <div className="property_first_last_div">
                <div>
                  <span>property name :</span>
                  <input
                    type="text"
                    id="name"
                    required
                    minLength="5"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
                <div>
                  <span>price :</span>
                  <input
                    type="text"
                    id="price"
                    required
                    onChange={handleChange}
                    value={formData.price}
                  />
                </div>
              </div>
              <div className="email_div">
                <span>address :</span>
                <input
                  type="text"
                  id="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
              <div className="email_div">
                <span>description of that property :</span>
                <textarea
                  type="text"
                  id="description"
                  required
                  rows="5"
                  cols="15"
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              <div className="property_sec_last_div">
                <div>
                  <span>no of bathrooms :</span>
                  <input
                    type="number"
                    id="bathrooms"
                    required
                    min="1"
                    max="10"
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                </div>
                <div>
                  <span>no of bedrooms :</span>
                  <input
                    type="number"
                    id="bedrooms"
                    required
                    min="1"
                    max="10"
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                </div>
                <div>
                  <span>no of hospitals :</span>
                  <input
                    type="number"
                    id="hospitals"
                    required
                    min="1"
                    max="10"
                    onChange={handleChange}
                    value={formData.hospitals}
                  />
                </div>
                <div className="college">
                  <span>no of college :</span>
                  <input
                    type="number"
                    id="college"
                    required
                    min="1"
                    max="10"
                    onChange={handleChange}
                    value={formData.college}
                  />
                </div>
                <div className="check_box_div">
                  <div className="">
                    <span>selling the property:</span>
                    <input
                      type="checkbox"
                      id="sale"
                      width="10px"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                    />
                  </div>
                  <div className="">
                    <span>rent the property:</span>
                    <input
                      type="checkbox"
                      id="rent"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="property_two_div">
              <div className="phonenumber_div">
                <span>seller number :</span>
                <input
                  type="text"
                  id="contactNumber"
                  onChange={handleChange}
                  value={formData.contactNumber}
                />
              </div>
              <div className="phonenumber_div">
                <span>seller email :</span>
                <input
                  type="email"
                  id="sellerEmail"
                  onChange={handleChange}
                  value={formData.sellerEmail}
                />
              </div>
              <div className="phonenumber_div">
                <span>property images :</span>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  multiple
                  onChange={(e) => serFile(e.target.files)}
                />
                <div className="property_images">
                  {formData.imageUrls.length > 0 &&
                    formData.imageUrls.map((url, index) => {
                      return (
                        <>
                          <div key={index}>
                            <div className="multile_img">
                              <img src={url} alt="" />
                            </div>
                            <button onClick={() => handleImageDelete(index)}>
                              delete
                            </button>
                          </div>
                        </>
                      );
                    })}
                </div>
                <button
                  onClick={handleImageSubmit}
                  className="image_upload_div"
                  type="button"
                >
                  <h3>{uploading ? "uploading ..." : "upload"}</h3>
                </button>
              </div>
              <div className="register_button">
                <button>
                  <h3>{loading ? "creating" : "create"}</h3>
                </button>
                {error && <span className="error_span">{error}</span>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Property;
