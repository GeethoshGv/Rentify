import "./nav.scss";
import { Link } from "react-router-dom";
import { search, user } from "../../assets/svg/index";

import { useSelector } from "react-redux";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <nav>
      <div className="maain_nav_div">
        <div className="logo_div">
          <Link to="/">
            <h1>Rentify</h1>
          </Link>
        </div>
        <div className="nav_combain_div">
          <div className="search_div"></div>

          <div className="link_div">
            <Link to="/profile">
              {currentUser ? (
                <img src={currentUser.avatar} alt="profile" />
              ) : (
                <h3>Login</h3>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
