import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, DollarSign } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Book & relax',
      description: 'We realize ideas from simple to complex, everything becomes easy to use.',
      color: 'bg-blue-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Smart checklist',
      description: 'Flight booking in your mind! Looking for cheap options! Cleartrip is your one-stop.',
      color: 'bg-orange-500',
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Save more',
      description: 'Find cheap flights, UK travel green list deals, hotels & car hire from over travel providers.',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Travel to make memories
            <br />
            all around the world
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-white rounded-full text-white hover:bg-white hover:text-slate-900 transition-colors"
          >
            View All
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="text-center p-8 glassmorphism-card rounded-3xl hover:shadow-2xl transition-shadow floating-animation"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-white mx-auto mb-6`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;