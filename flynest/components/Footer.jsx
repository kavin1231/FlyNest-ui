import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'About us',
      links: ['Careers', 'Media Centre', 'Our planet', 'Our people', 'Our communities'],
    },
    {
      title: 'Experience',
      links: ['Cabin features', 'Shop SkyVoyage', 'Dining', 'Our lounges', 'Open Skies'],
    },
    {
      title: 'Where we fly',
      links: ['Route map', 'Asia and Pacific', 'The Americas', 'Europe', 'The Middle East'],
    },
    {
      title: 'Before you fly',
      links: ['Baggage', 'Visa and passport', 'Travel information', 'International Airport', 'To and from the airport'],
    },
    {
      title: 'Loyalty',
      links: ['Log in to Skywards', 'Join Skywards', 'Business Rewards benefits', 'Our partners', 'Register your company'],
    },
  ];

  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Subscribe Newsletter &</h2>
          <h3 className="text-3xl font-bold mb-8">get latest News</h3>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your E-mail address"
              className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-l-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 sky-gradient text-white font-semibold rounded-r-full hover:shadow-lg transition-shadow"
            >
              Subscribe Now
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-700"
        >
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Plane className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold">SkyVoyage</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@skyvoyage.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>New York, NY</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8 pt-8 border-t border-slate-700 text-sm text-gray-400">
          <p>&copy; 2024 SkyVoyage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;