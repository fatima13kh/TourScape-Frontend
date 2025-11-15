import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../../favorites/FavoriteButton/FavoriteButton";
import { useUser } from "../../../contexts/UserContext";

function TourCard({ tour, isCompanyView, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleCardClick = () => {
    if (!isCompanyView) {
      navigate(`/tours/${tour._id}`);
    }
  };

  return (
    <div onClick={handleCardClick}>
      {/* Favorite button - travelers only */}
      {!isCompanyView && user?.role === "traveler" && (
        <FavoriteButton tourId={tour._id} />
      )}

      {/* Destination */}
      <div>
        <h3>{tour.destination}</h3>
      </div>

      {/* Title and theme */}
      <div>
        <h2>{tour.title}</h2>
        <span>{tour.theme}</span>
      </div>

      {/* Description */}
      <p>
        {tour.description.length > 100
          ? tour.description.substring(0, 100) + "..."
          : tour.description}
      </p>

      {/* Price */}
      <div>
        <p>Price: {tour.price} per person</p>
        {!isCompanyView && <p>Company: {tour.companyName}</p>}
      </div>

      {/* Edit/Delete buttons for tour company */}
      {isCompanyView && (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tour);
            }}
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tour._id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TourCard;
