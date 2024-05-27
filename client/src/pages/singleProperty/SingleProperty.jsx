import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./singlepro.scss";
import { bath, bed, hospital, sale, college } from "../../assets/svg/index.js";

const SingleProperty = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProperty(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <section className="single_section">
      {loading && <span>Loading...</span>}
      {error && <span>Something went wrong!</span>}

      <div className="single_main_div">
        <div className="single_one">
          <div className="single_img_div">
            {property &&
              property.imageUrls &&
              property.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`Image ${i}`} />
              ))}
          </div>
        </div>
        <div className="single_two">
          <div className="single_product_detial_div">
            <div className="detial_one">
              <div className="mini">
                <h2>Name :</h2>
                <h3>{property && property.name}</h3>
              </div>
              <div className="mini">
                <h2>price :</h2>
                <h3>{property && property.price}</h3>
              </div>
              <div className="mini big">
                <h2>Address :</h2>
                <h3>{property && property.address}</h3>
              </div>
              <div className="mini  big">
                <h2>Description :</h2>
                <h3>{property && property.description}</h3>
              </div>
            </div>
            <div className="detial_two">
              <div className="two_center_div">
                <div className="min">
                  <h2>Bedrooms </h2>
                  <div className="single_svg_div">
                    <img src={bed} alt="" />

                    <h3>{property && property.bedrooms}</h3>
                  </div>
                </div>
                <div className="min">
                  <h2>College </h2>
                  <div className="single_svg_div">
                    <img src={college} alt="" />

                    <h3>{property && property.college}</h3>
                  </div>
                </div>
                <div className="min">
                  <h2>Bathrooms </h2>
                  <div className="single_svg_div">
                    <img src={bath} alt="" />

                    <h3>{property && property.bathrooms}</h3>
                  </div>
                </div>

                <div className="min">
                  <h2>Hospitals </h2>
                  <div className="single_svg_div">
                    <img src={hospital} alt="" />

                    <h3>{property && property.hospitals}</h3>
                  </div>
                </div>
                <div className="min">
                  <h2>Type </h2>
                  <div className="single_svg_div">
                    <img src={sale} alt="" />

                    <h3>
                      {property && property.type === "rent" ? "rent" : " sale"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="detial_three">
              <div className="three_center_div">
                <div className="im_iintrested_div">
                  <div className="in_button">
                    {currentUser && (
                      <div>
                        <button
                          className="im"
                          onClick={() => setContact(!contact)}
                        >
                          <h3>I'm interested</h3>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="in_contact">
                    {contact && (
                      <div className="hidden_seller_det">
                        {" "}
                        <div className="mini">
                          <h2>Seller email :</h2>
                          <h3>{property && property.sellerEmail}</h3>
                        </div>
                        <div className="mini">
                          <h2>Seller contact :</h2>
                          <h3>{property && property.contactNumber}</h3>
                        </div>
                        <Link
                          to={`mailto:${property.sellerEmail}?subject=Regarding ${property.name}&body= for${property.type}`}
                        >
                          <button className="mail_button">send mail</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProperty;
