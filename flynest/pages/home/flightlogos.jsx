import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Plane, Filter } from "lucide-react";
import Header from "../../components/Header";

const FlightLogos = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Comprehensive list of airlines with their logos and websites
  const airlines = [
    // Major International Airlines
    {
      name: "Emirates",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png",
      website: "https://www.emirates.com",
      region: "Middle East",
      country: "UAE",
    },
    {
      name: "Qatar Airways",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png",
      website: "https://www.qatarairways.com",
      region: "Middle East",
      country: "Qatar",
    },
    {
      name: "Singapore Airlines",
      logo: "http://pluspng.com/img-png/logo-singapore-airlines-png-singapore-airlines-logo-01-1453.png",
      website: "https://www.singaporeair.com",
      region: "Asia",
      country: "Singapore",
    },
    {
      name: "Lufthansa",
      logo: "https://loghi-famosi.com/wp-content/uploads/2021/01/Lufthansa-Simbolo.png",
      website: "https://www.lufthansa.com",
      region: "Europe",
      country: "Germany",
    },
    {
      name: "British Airways",
      logo: "https://logos-world.net/wp-content/uploads/2021/02/British-Airways-Logo-1984-1997.png",
      website: "https://www.britishairways.com",
      region: "Europe",
      country: "UK",
    },
    {
      name: "Air France",
      logo: "https://pluspng.com/img-png/air-france-logo-png-air-france-logos-brands-and-logotypes-4933x685.png",
      website: "https://www.airfrance.com",
      region: "Europe",
      country: "France",
    },
    {
      name: "KLM",
      logo: "https://i.pinimg.com/originals/a5/41/6e/a5416ed42e1c59e5f052946a29d283aa.png",
      website: "https://www.klm.com",
      region: "Europe",
      country: "Netherlands",
    },
    {
      name: "Turkish Airlines",
      logo: "https://logos-world.net/wp-content/uploads/2020/03/Turkish-Airlines-Logo-2010-2017.png",
      website: "https://www.turkishairlines.com",
      region: "Europe",
      country: "Turkey",
    },

    // Asian Airlines
    {
      name: "Cathay Pacific",
      logo: "https://logos-world.net/wp-content/uploads/2023/02/Cathay-Pacific-Logo.png",
      website: "https://www.cathaypacific.com",
      region: "Asia",
      country: "Hong Kong",
    },
    {
      name: "ANA",
      logo: "https://www.freelogovectors.net/wp-content/uploads/2018/08/ana-airways-logo-900x227.png",
      website: "https://www.ana.co.jp",
      region: "Asia",
      country: "Japan",
    },
    {
      name: "Japan Airlines",
      logo: "https://1000logos.net/wp-content/uploads/2021/04/Japan-Airlines-logo.png",
      website: "https://www.jal.com",
      region: "Asia",
      country: "Japan",
    },
    {
      name: "Thai Airways",
      logo: "https://1000logos.net/wp-content/uploads/2020/04/Thai-Airways-Logo.png",
      website: "https://www.thaiairways.com",
      region: "Asia",
      country: "Thailand",
    },
    {
      name: "Malaysia Airlines",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Malaysia-Airlines-Logo-1987.png",
      website: "https://www.malaysiaairlines.com",
      region: "Asia",
      country: "Malaysia",
    },
    {
      name: "Korean Air",
      logo: "https://www.nicepng.com/png/full/44-440792_logo-korean-air.png",
      website: "https://www.koreanair.com",
      region: "Asia",
      country: "South Korea",
    },
    {
      name: "IndiGo",
      logo: "https://logonoid.com/images/indigo-logo.png",
      website: "https://www.goindigo.in",
      region: "Asia",
      country: "India",
    },
    {
      name: "Air India",
      logo: "https://logos-world.net/wp-content/uploads/2023/02/Air-India-Logo.png",
      website: "https://www.airindia.in",
      region: "Asia",
      country: "India",
    },
     {
      name: "SriLankan Airlines",
      logo: "https://cdn.freebiesupply.com/logos/large/2x/sri-lankan-airlines-logo-png-transparent.png",
      website: "https://careers.srilankan.com/group/#",
      region: "Asia",
      country: "Srilanka",
    },

    // American Airlines
    {
      name: "American Airlines",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/American-Airlines-Logo.png",
      website: "https://www.aa.com",
      region: "Americas",
      country: "USA",
    },
    {
      name: "Delta Air Lines",
      logo: "https://logos-world.net/wp-content/uploads/2021/08/Delta-Air-Lines-Second-era-Logo-1966-1976.png",
      website: "https://www.delta.com",
      region: "Americas",
      country: "USA",
    },
    {
      name: "United Airlines",
      logo: "https://1000logos.net/wp-content/uploads/2017/06/United-logo.png",
      website: "https://www.united.com",
      region: "Americas",
      country: "USA",
    },
    {
      name: "JetBlue",
      logo: "https://download.logo.wine/logo/JetBlue/JetBlue-Logo.wine.png",
      website: "https://www.jetblue.com",
      region: "Americas",
      country: "USA",
    },
    {
      name: "Southwest Airlines",
      logo: "https://logos-world.net/wp-content/uploads/2020/10/Southwest-Airlines-Logo-1998-2014.png",
      website: "https://www.southwest.com",
      region: "Americas",
      country: "USA",
    },
    {
      name: "Air Canada",
      logo: "https://logos-world.net/wp-content/uploads/2021/05/Air-Canada-Logo.png",
      website: "https://www.aircanada.com",
      region: "Americas",
      country: "Canada",
    },

    // Middle Eastern Airlines
    {
      name: "Etihad Airways",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Etihad-Airways-Logo.png",
      website: "https://www.etihad.com",
      region: "Middle East",
      country: "UAE",
    },
    {
      name: "Saudi Arabian Airlines",
      logo: "https://iconlogovector.com/uploads/images/2023/11/lg-6562d265e1226-saudia-saudi-arabian-airline.png",
      website: "https://www.saudia.com",
      region: "Middle East",
      country: "Saudi Arabia",
    },
    {
      name: "Kuwait Airways",
      logo: "https://1000logos.net/wp-content/uploads/2021/04/Kuwait-Airways-logo.png",
      website: "https://www.kuwaitairways.com",
      region: "Middle East",
      country: "Kuwait",
    },

    // African Airlines
    {
      name: "Ethiopian Airlines",
      logo: "https://1000logos.net/wp-content/uploads/2020/04/Ethiopian-Airlines-Logo.png",
      website: "https://www.ethiopianairlines.com",
      region: "Africa",
      country: "Ethiopia",
    },
    {
      name: "South African Airways",
      logo: "https://cdn.freebiesupply.com/logos/large/2x/south-african-airways-logo-png-transparent.png",
      website: "https://www.flysaa.com",
      region: "Africa",
      country: "South Africa",
    },
    {
      name: "EgyptAir",
      logo: "https://4.bp.blogspot.com/-GM4dsJLCBQU/Vyro1dAlleI/AAAAAAAAI-E/p26_lkf6kE8SBPRE-h58oiW5ccN9RgXZQCLcB/s1600/EgyptAir%2BLogo.png",
      website: "https://www.egyptair.com",
      region: "Africa",
      country: "Egypt",
    },

    // Oceania Airlines
    {
      name: "Qantas",
      logo: "https://1000logos.net/wp-content/uploads/2017/05/Qantas-Logo.png",
      website: "https://www.qantas.com",
      region: "Oceania",
      country: "Australia",
    },
    {
      name: "Virgin Australia",
      logo: "https://1000logos.net/wp-content/uploads/2023/05/Virgin-Australia-Logo-1536x864.png",
      website: "https://www.virginaustralia.com",
      region: "Oceania",
      country: "Australia",
    },
    {
      name: "Air New Zealand",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Air-New-Zealand-Logo-2006.png",
      website: "https://www.airnewzealand.com",
      region: "Oceania",
      country: "New Zealand",
    },

    // Budget Airlines
    {
      name: "Ryanair",
      logo: "https://1000logos.net/wp-content/uploads/2020/03/Ryanair-Logo.png",
      website: "https://www.ryanair.com",
      region: "Europe",
      country: "Ireland",
    },
    {
      name: "EasyJet",
      logo: "https://1000logos.net/wp-content/uploads/2020/03/EasyJet-Logo.png",
      website: "https://www.easyjet.com",
      region: "Europe",
      country: "UK",
    },
    {
      name: "AirAsia",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/AirAsia-Logo-2002.png",
      website: "https://www.airasia.com",
      region: "Asia",
      country: "Malaysia",
    },
    {
      name: "Cebu Pacific",
      logo: "https://logos-download.com/wp-content/uploads/2016/10/Cebu_Pacific_Air_logo_logotype.png",
      website: "https://www.cebupacificair.com",
      region: "Asia",
      country: "Philippines",
    },

    // Regional Airlines
    {
      name: "Pakistan International Airlines",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Pakistan-International-Airlines-Logo-2015.png",
      website: "https://www.piac.com.pk",
      region: "Asia",
      country: "Pakistan",
    },
    {
      name: "Bangladesh Biman",
      logo: "https://logos-world.net/wp-content/uploads/2023/05/Biman-Bangladesh-Airlines-Logo-2010.png",
      website: "https://www.biman-airlines.com",
      region: "Asia",
      country: "Bangladesh",
    },
  ];

  const filters = [
    "All",
    "Asia",
    "Europe",
    "Americas",
    "Middle East",
    "Africa",
    "Oceania",
  ];

  const filteredAirlines =
    activeFilter === "All"
      ? airlines
      : airlines.filter((airline) => airline.region === activeFilter);

  const handleAirlineClick = (website) => {
    window.open(website, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-black text-white"
    >
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Page Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-12 w-12 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold text-yellow-400">
              Airlines Directory
            </h1>
          </div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Discover and connect with airlines worldwide. Click on any airline
            logo to visit their official website and explore their services.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                    : "bg-slate-800/60 text-gray-300 hover:bg-slate-700 border border-slate-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="text-center text-gray-400">
            <Filter className="inline h-4 w-4 mr-2" />
            Showing {filteredAirlines.length} airlines
          </div>
        </motion.div>

        {/* Airlines Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {filteredAirlines.map((airline, index) => (
            <motion.div
              key={airline.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAirlineClick(airline.website)}
              className="group cursor-pointer"
            >
              <div className="bg-slate-800/60 backdrop-blur border border-slate-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-yellow-400 relative overflow-hidden h-44 flex flex-col">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Logo Container */}
                <div className="relative z-10 flex items-center justify-center flex-1 mb-4">
                  <img
                    src={airline.logo}
                    alt={`${airline.name} logo`}
                    className="max-h-16 max-w-full object-contain filter brightness-125 group-hover:brightness-150 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><rect width="100" height="60" fill="%23f3f4f6"/><text x="50" y="30" text-anchor="middle" dy=".3em" font-family="Arial" font-size="8" fill="%236b7280">${airline.name}</text></svg>`;
                    }}
                  />
                </div>

                {/* Airline Info */}
                <div className="relative z-10 text-center flex-shrink-0">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1">
                    {airline.name}
                  </h3>
                  <p className="text-xs text-gray-300 mb-2 line-clamp-1">
                    {airline.country}
                  </p>

                  {/* External Link Icon */}
                  <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">
              Connect with Airlines Worldwide
            </h3>
            <p className="text-gray-300 mb-4">
              Explore official airline websites to book flights, check
              schedules, manage bookings, and discover exclusive deals directly
              from the source.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <ExternalLink className="h-4 w-4 mr-2" />
              External links will open in a new tab
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlightLogos;
