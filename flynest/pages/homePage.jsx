import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import SearchForm from "../components/searchForm";
import FeatureCards from "../components/featureCards";
import TravelSupport from "../components/travelSupport";
import BestTravelers from "../components/bestTravelers";
import HeroPage from "../components/heroPage.jsx";
import Header from "../components/Header.jsx";

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
      <Header />
      <div className="relative">
        <HeroPage />
        {/* Search form positioned over the hero section */}
        <SearchForm onSearch={handleSearch} />
      </div>
      {/* Reduced spacing between sections */}
      <div className="mt-8">
        <TravelSupport />
      </div>
      <FeatureCards />
      <BestTravelers />
    </motion.div>
  );
};

export default HomePage;
