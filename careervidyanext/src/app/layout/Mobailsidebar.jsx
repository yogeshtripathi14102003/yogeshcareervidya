import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = ({ mainMenu, setMainMenu }) => {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const menu = [
    {
      title: "COMPANY",
      items: [
        { name: "About Us", link: "/about" },
        {
          name: "Work Culture",
          link: "/",
        },
        { name: "Our Partners", link: "/" },
        { name: "Careers", link: "/careers" },
        {
          name: "Event/Webinar",
          link: "/",
        },
        {
          name: "Careers",
          link: "/careers",
        },
      ],
    },
    {
      title: "SERVICE",
      items: [
        // Add more
        { name: "AWS", link: "/aws" },
        { name: "Cybersecurity", link: "/cybersercurity" },
        { name: "DevOps", link: "/devops" },
        { name: "Mobile App Development", link: "/mobile" },
        { name: "Native App Development", link: "/app" },
        { name: "Software Development", link: "/software" },
        {
          name: "Cross Platform Development",
          link: "/cross_platform_development",
        },
        { name: "IOT Development", link: "/iot_development" },
        { name: "UI & UX Designing", link: "/ui&ux" },
        { name: "Website Development", link: "/website" },
      ],
    },
    {
      title: "INVESTER",
      items: [],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[60vw] bg-blue-50 text-black p-4 z-40 transform transition-transform duration-300 ease-in-out ${
        mainMenu ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => setMainMenu(false)}
            className="text-gray-600 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        {menu.map((section, index) => (
          <div key={index} className="mb-3">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              <h3 className="font-semibold text-md">{section.title}</h3>
              {openSection === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openSection === index && (
              <ul className="mt-2 pl-2 space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Link
                      to={item.link}
                      onClick={() => setMainMenu(false)}
                      className="text-sm text-gray-700"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div>
          <h3 className="font-semibold text-md">BLOG</h3>
        </div>
        <Link to="/contact" onClick={() => setMainMenu(false)}>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold text-sm">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
