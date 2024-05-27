import { useEffect, useState } from "react";
import "./home.scss";
import { Link } from "react-router-dom";
import house from "../assets/img/house.jpg";
import down from "../assets/img/down.png";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/listing/get")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      data.forEach((item) => {
        console.log(item._id);
      });
    }
  }, [data]);

  return (
    <section className="home_section">
      <div className="home_div">
        <div className="home_text_div">
          <h1>Rentify.</h1>
          <p>
            Your one stop shop for all your mortgage and sales needs. Whether
            you’re looking to find the perfect place to call home or you’re
            searching for the ideal location for your business, Rentify offers a
            wide range of properties to rent or buy.
          </p>
        </div>
        <div className="home_img_div">
          <img src={house} alt="" />
        </div>
        <div className="view_pro_svg">
          <div className="svg_center_div">
            <p>View Property </p>
            <img src={down} alt="" />
          </div>
        </div>
      </div>

      <div className="home_sec_div">
        <h2>View property</h2>
        <div className="gg">
          {data.length > 0 &&
            data.map((item, index) => (
              <div className="home_box" key={index}>
                <Link to={`/singleProperty/${item._id}`} key={index}>
                  <div>
                    <div className="card_img">
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <img src={item.imageUrls[0]} alt={item.name} />
                      )}
                    </div>
                    <div className="cardtitle_div">
                      <p>{item.name}</p>
                    </div>
                    <div className="price_div">
                      <p>price :</p>
                      <span>{item.price}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
