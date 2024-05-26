import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./singlepro.scss";

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

  console.log(property);
  return (
    <section className="single_section">
      {loading && <span>Loading...</span>}
      {error && <span>Something went wrong!</span>}

      <div className="single_main_div">
        <div className="single_zero">
          <div className="single_img">
            {property &&
              property.imageUrls &&
              property.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`Image ${i}`} />
              ))}
          </div>
        </div>
        <div className="single_one">
          <div className="mini">
            <h2>Name :</h2>
            <h2>{property && property.name}</h2>
          </div>
          <div className="mini">
            <h2>price :</h2>
            <h2>{property && property.price}</h2>
          </div>
          <div className="mini">
            <h2>description :</h2>

            <h2>{property && property.description}</h2>
          </div>
        </div>
        <div className="single_two">
          <div className="mini">
            <h2>No of bedrooms :</h2>

            <h2>{property && property.bedrooms}</h2>
          </div>
          <div className="mini">
            <h2>No of college :</h2>

            <h2>{property && property.college}</h2>
          </div>
          <div className="mini">
            <h2>No of bathrooms :</h2>

            <h2>{property && property.bathrooms}</h2>
          </div>
          <div className="mini">
            <h2>No of hospitals :</h2>

            <h2>{property && property.hospitals}</h2>
          </div>

          <div className="mini">
            <h2>Address :</h2>

            <h2>{property && property.address}</h2>
          </div>
          <div className="mini">
            <h2>Type :</h2>

            <h2>{property && property.type === "rent" ? "rent" : " sale"}</h2>
          </div>
        </div>

        {currentUser && (
          <div>
            <button className="im" onClick={() => setContact(!contact)}>
              <h3>I'm interested</h3>
            </button>
          </div>
        )}
        {contact && (
          <div>
            {" "}
            <div className="mini">
              <h2>contact :</h2>
              <h2>{property && property.contactNumber}</h2>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SingleProperty;
