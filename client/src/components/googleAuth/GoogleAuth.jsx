import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { signInSuccess } from "../../redux/user/userSlice";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      //sending name email profile to the backend

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("nope", error);
    }
  };

  return (
    <button type="button" onClick={handleGoogleAuth}>
      <h3>Google</h3>
    </button>
  );
};

export default GoogleAuth;
