import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Tag, Search } from "lucide-react";

const Sidebar = ({ categories, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-500 to-blue-700 shadow-lg z-50 ${
        isOpen ? "block" : "hidden"
      }`}
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center p-4 text-white">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-md">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            className="ml-2 flex-grow bg-transparent focus:outline-none"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.ul
        className="p-4 space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {filteredCategories.map((category) => (
          <motion.li
            key={category.value}
            className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-md shadow hover:bg-gray-100 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => onCategorySelect(category.value)}
          >
            <Tag size={18} className="text-blue-600" />
            <span>{category.label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default Sidebar;
