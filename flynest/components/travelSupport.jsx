import React from 'react';
import { motion } from 'framer-motion';

const TravelSupport = () => {
  const supportItems = [
    {
      number: '01',
      title: 'Travel requirements for Dubai',
      description: 'Momondo is by far one of the best travel websites for sourcing travel deals.',
      color: 'bg-blue-500',
    },
    {
      number: '02',
      title: 'Multi-risk travel insurance',
      description: 'Momondo is by far one of the best travel websites for sourcing travel deals.',
      color: 'bg-orange-500',
    },
    {
      number: '03',
      title: 'Travel requirements by destination',
      description: 'Momondo is by far one of the best travel websites for sourcing travel deals.',
      color: 'bg-yellow-500',
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
          <p className="text-yellow-400 font-medium mb-4 tracking-wider uppercase">Travel Support</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Plan your travel with confidence
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find help with your bookings and travel plans, and see what to expect along your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Support items */}
          <div className="space-y-8">
            {supportItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {item.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right side - Circular images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-80 h-80">
              {/* Large circle - airplane wing view */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Airplane wing view"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Medium circle - travel destination */}
              <div className="absolute bottom-8 left-0 w-36 h-36 rounded-full overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Travel destination"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Small circle - luggage */}
              <div className="absolute top-16 left-8 w-24 h-24 rounded-full overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Travel luggage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TravelSupport;