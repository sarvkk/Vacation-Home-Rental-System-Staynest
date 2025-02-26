import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import getUserName from "../../utils/getUserName";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HousePlus, ClipboardCheck, Trash, Cog } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HostingSetup.css";

import UpdateListingModal from "./UpdateListingModal";

const HostingSetup = () => {
  const [name, setName] = useState("");
  const [reserved, setIsReserverd] = useState(false);
  const [listings, setListings] = useState(false);
  const [listingData, setListingData] = useState([]);

  console.log(listingData);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getUserName(setName, navigate);
  }, [navigate]);

  const fetchListingData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/become-a-host/listing",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response status", response.status);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setListings(true);
        setListingData(data); // Save array of listings
        console.log("success");
      } else {
        console.log("Error fetching listing data");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const checkCachedData = () => {
    const cachedData = localStorage.getItem("cachedListings");
    if (cachedData) {
      setListingData(JSON.parse(cachedData));
    } else {
      fetchListingData();
    }
  };

  useEffect(() => {
    checkCachedData();
  }, []);

  // Slick settings for the carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Do you want to delete this property.");
    if (!confirmed) {
      return console.log("Cancelled");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/become-a-host/listing",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        const message = data.message;
        toast.success(message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const message = data;
        toast.error(message.message);
        toast.error(message.errorMessage);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdate = (listing) => {
    setSelectedListing(listing);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/become-a-host/listing",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "listing updated successfully");
        setShowUpdateModal(false);
        fetchListingData();
      } else {
        toast.error(data.message || "Error updating listing");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Error updating listing");
    }
  };

  return (
    <>
      <Header showPropertyOptions={false} showSearch={false} />
      <section className="realestate-hosting-wrapper">
        <div className="hosting-header">
          <h1>Welcome back, {name}</h1>
          <Link to="/become-a-host">
            <button className="create-a-listing-button">
              Create a Listing
            </button>
          </Link>
        </div>
        <div className="hosting-status-description">
          <h2>Your reservations</h2>
          <div className="show-reservations">
            {reserved ? (
              <div></div>
            ) : (
              <div className="nothing-to-do">
                <div className="nothing-to-do-inner-div">
                  <ClipboardCheck size={40} />
                  <p>You don&apos;t have any properties booked.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="listing-status-description">
          <h2>Your listings</h2>
          <div className="show-listings">
            {listings && listingData.length > 0 ? (
              <div className="listing-card-container">
                {listingData.map((listing, index) => (
                  <div key={index} className="listing-card">
                    <h1>Property {index + 1}</h1>

                    <Trash
                      className="delete-listing"
                      onClick={() => handleDelete(listing.id)}
                      size={35}
                    />
                    <Cog
                      className="update-listing"
                      onClick={() => handleUpdate(listing)}
                      size={35}
                    />
                    <Slider {...sliderSettings}>
                      {listing.imageUrls.map((image, imgIndex) => (
                        <div key={imgIndex} className="listing-card-image">
                          <img
                            src={image}
                            alt={`Property image ${imgIndex + 1}`}
                          />
                        </div>
                      ))}
                    </Slider>
                    <div className="listing-card-detail">
                      <h3>{listing.title}</h3>
                      <p>
                        <span className="listing-card-detail-head">Type: </span>
                        {listing.propertyType}
                      </p>
                      <p>
                        <span className="listing-card-detail-head">
                          Region:{" "}
                        </span>
                        {listing.propertyRegion}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Location:{" "}
                        </span>
                        {listing.approximateLocation}
                      </p>
                      <p>
                        <span className="listing-card-detail-head">
                          Price:{" "}
                        </span>{" "}
                        Rs {formatPrice(listing.price)} night
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Guest allowed:{" "}
                        </span>{" "}
                        {listing.guests}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Bedrooms:{" "}
                        </span>{" "}
                        {listing.bedrooms}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">Beds: </span>{" "}
                        {listing.beds}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Bathroom:{" "}
                        </span>
                        {listing.bathrooms}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Kitchen:{" "}
                        </span>
                        {listing.kitchens}
                      </p>

                      <p>
                        <span className="listing-card-detail-head">
                          Amenities:{" "}
                        </span>
                        {JSON.parse(listing.amenities).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="nothing-to-do">
                <div className="nothing-to-do-inner-div">
                  <HousePlus size={40} />
                  <p>You don&apos;t have any listing created.</p>
                  <Link to="/become-a-host">
                    <button className="create-a-listing-button">
                      Create now
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {showUpdateModal && (
        <UpdateListingModal
          listing={selectedListing}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleUpdateSubmit}
        />
      )}
      <Footer />
    </>
  );
};

export default HostingSetup;
