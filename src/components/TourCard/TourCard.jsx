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

  

export default TourCard;
