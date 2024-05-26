//===========router=============

import { BrowserRouter, Routes, Route } from "react-router-dom";

//===========router=============

//===========page=============

import Home from "./pages/Home";
import Login from "./Auth/login/Login";
import Register from "./Auth/register/Register";
import Profile from "./pages/profile/Profile";
import PrivateRoute from "./components/PrivateRoute";

//===========page=============
//===========components=============

import Navbar from "./components/navbar/Navbar";
import Property from "./pages/createProperty/Property";
import UpdateProperty from "./pages/updateProperty/UpdateProperty";
import SingleProperty from "./pages/singleProperty/SingleProperty";

//===========components=============

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/singleProperty/:listingId" element={<SingleProperty />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-property" element={<Property />} />
          <Route
            path="/updateproperty/:listingId"
            element={<UpdateProperty />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
