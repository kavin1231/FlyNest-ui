import React from 'react';
import { motion } from 'framer-motion';

const BestTravelers = () => {
  const travelers = [
    {
      name: 'Kavin Fernando',
      location: 'Dubai, UAE',
      image: '/ceo photo.jpg',
      destination: 'https://www.touristiknews.de/wp-content/uploads/2022/09/Hilton-Dubai-Palm-Jumeirah-Beach-scaled.jpg',
    },
    {
      name: 'James Noah',
      location: 'Gomolo, leqbl',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      destination: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Levi Tarisha',
      location: 'efium veilland 73',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
      destination: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Sebastian johan',
      location: 'Stockholm#49',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
      destination: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Best travelers of the Month
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {travelers.map((traveler, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className="w-full h-64 rounded-3xl overflow-hidden relative group">
                <img
                  src={traveler.destination}
                  alt={`${traveler.name} destination`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Profile Image */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-4 left-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={traveler.image}
                      alt={traveler.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                
                {/* Name and Location */}
                <div className="absolute bottom-4 right-4 text-right">
                  <h3 className="text-white font-semibold">{traveler.name}</h3>
                  <p className="text-gray-300 text-sm">{traveler.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestTravelers;