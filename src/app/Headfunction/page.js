"use client";

import { useState, useEffect, useRef } from "react";
import "./Headfunction.css";

export default function Headfunction() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null); // ใช้ ref เพื่อตรวจจับการคลิกข้างนอก

  const categories = ["ฟุตบอล", "บาสเกตบอล", "เทนนิส", "แบดมินตัน", "ว่ายน้ำ"];

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="nav-container">
      {/* Filter + ประเภทกีฬา */}
      <div className="filter-dropdown-group" ref={dropdownRef}>
        <img src="/picturemild/Filter.png" alt="Filter" className="filter" />
        <button
          className="nav-button"
          onClick={(e) => {
            e.stopPropagation(); // ป้องกัน dropdown ปิดเองเมื่อกดปุ่ม
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          ประเภทกีฬา
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            {categories.map((category, index) => (
              <li key={index} className="dropdown-item">
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* แถบค้นหา */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหาสนามกีฬา / สถานที่"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <img src="/picturemild/Find.png" alt="Find" className="find" />
      </div>
    </nav>
  );
}
