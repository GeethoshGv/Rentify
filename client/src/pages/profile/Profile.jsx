import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase/firebase";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "../../redux/user/userSlice.js";

import "./profile.scss";

const Profile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucc, setUpdateSuccess] = useState(false);
  const [showProperty, setShowProperty] = useState(false);
  const [userProperty, setUserProperty] = useState([]);
  useEffect(() => {
    if (file) {
      fileUpload(file);
    }
  }, [file]);

  const fileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteUserAccount = async () => {
    try {
      dispatch(deleteUserStart);

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const signOutFunction = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess());
    } catch (error) {
      dispatch(logoutUserFailure());
    }
  };

  const handleShowProperty = async () => {
    try {
      setShowProperty(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowProperty(true);
        return;
      }
      setUserProperty(data);
      console.log(userProperty);
    } catch (error) {
      setShowProperty(false);
    }
  };
  const handlePropertyDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      userProperty((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <section className="register_section">
      <div className="main_register_div">
        <div className="form_div">
          <form action="" onSubmit={handleSubmit}>
            <div className="first_title_img_div">
              <div className="profile_title_div">
                <h1>Profile</h1>
              </div>
              <div className="profile_img_div">
                <div className="size_div">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                  />
                  <img
                    src={formData.avatar || currentUser.avatar}
                    alt=""
                    onClick={() => fileRef.current.click()}
                  />
                </div>
              </div>
            </div>

            {fileUploadError ? (
              <span>Error while uploading image</span>
            ) : fileProgress > 0 && fileProgress < 100 ? (
              <span>{`uploading ${fileProgress}%`}</span>
            ) : fileProgress === 100 ? (
              <span>image uploaded </span>
            ) : (
              ""
            )}

            <div className="first_last_div">
              <div>
                <span>First name :</span>
                <input
                  type="text"
                  id="firstname"
                  defaultValue={currentUser.firstname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <span>Last name :</span>
                <input
                  type="text"
                  id="lastname"
                  defaultValue={currentUser.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="email_div">
              <span>Username :</span>
              <input
                type="text"
                id="username"
                defaultValue={currentUser.username}
                onChange={handleChange}
              />
            </div>
            <div className="email_div">
              <span>Email :</span>
              <input
                type="text"
                id="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </div>
            <div className="password_div">
              <span>Password :</span>
              <input type="password" id="password" onChange={handleChange} />
            </div>
            <div className="phonenumber_div">
              <span>Phonenumber :</span>
              <input
                type="text"
                id="phone"
                defaultValue={currentUser.phone}
                onChange={handleChange}
              />
            </div>
            <div className="register_button">
              <button>
                <h3>{loading ? "Updating ..." : "Update"}</h3>
              </button>
            </div>

            <span>{updateSucc ? "updated successfully" : ""}</span>
            <span>{error ? error : ""}</span>
          </form>
        </div>
        <div className="listing_div">
          <div className="sign_out_delete_div">
            <button onClick={signOutFunction}>
              <h3>sign-out</h3>
            </button>
            <button onClick={deleteUserAccount}>
              <h3>Delete</h3>
            </button>
          </div>
          <div className="listing_title_div">
            <div className="create_property">
              <Link to={"/create-property"}>
                <button>
                  <h3>Create property</h3>
                </button>
              </Link>
              <button onClick={handleShowProperty}>
                <h3>View property</h3>
              </button>
            </div>
          </div>
          <div className="div_userProperty">
            {userProperty &&
              userProperty.length > 0 &&
              userProperty.map((listing) => {
                return (
                  <>
                    <div className="showuserProperty">
                      <div className="showuserProperty_one">
                        <Link to={`/singleProperty/${listing._id}`}>
                          <img src={listing.imageUrls[0]} alt="listing cover" />
                        </Link>
                        <p>{listing.name}</p>
                      </div>
                      <div className="showuserProperty_one_button">
                        <button
                          onClick={() => handlePropertyDelete(listing._id)}
                        >
                          Delete
                        </button>

                        <Link to={`/updateproperty/${listing._id}`}>
                          <button className="bb">Edit</button>
                        </Link>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
