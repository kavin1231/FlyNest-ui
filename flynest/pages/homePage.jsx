import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import SearchForm from "../components/searchForm";
import FeatureCards from "../components/featureCards";
import TravelSupport from "../components/travelSupport";
import BestTravelers from "../components/bestTravelers";
import HeroPage from "../components/heroPage.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchData) => {
    navigate("/flights", { state: searchData });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20"
    >
      <HeroPage />
      <SearchForm onSearch={handleSearch} />
      <TravelSupport />
      <FeatureCards />
      <BestTravelers />
    </motion.div>
  );
};

export default HomePage;
