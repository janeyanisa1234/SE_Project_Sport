"use client";
 
import { useState, useEffect, useRef } from "react";
import "./Headfunction.css";
import Link from "next/link";
import axios from "axios";
 
export default function Headfunction() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/bookings/sports-categories", {
          timeout: 10000,
        });
        console.log("Response from /bookings/sports-categories:", response.data);
        
        if (Array.isArray(response.data)) {
          // กรองข้อมูลให้ไม่ซ้ำกันโดยใช้ Set
          const uniqueCategories = [...new Set(response.data)];
          setCategories(uniqueCategories);
        } else {
          throw new Error("Invalid data format from /bookings/sports-categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          console.log("Response Status:", error.response.status);
        } else if (error.request) {
          console.log("No Response Received:", error.request);
        }
        // Fallback: กรองค่าซ้ำออกจาก array ค่าเริ่มต้นด้วย
        const fallbackCategories = ["ฟุตบอล", "บาสเกตบอล", "เทนนิส", "แบดมินตัน", "ว่ายน้ำ"];
        setCategories([...new Set(fallbackCategories)]);
      }
    };
    fetchCategories();
  }, []);
 
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
      <div className="filter-dropdown-group" ref={dropdownRef}>
 
        <button
          className="nav-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          ประเภทกีฬา
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <li key={index} className="dropdown-item">
                  <Link
                    href={{
                      pathname: "/Homepage/Search",
                      query: { category: encodeURIComponent(category) },
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {category}
                  </Link>
                </li>
              ))
            ) : (
              <li className="dropdown-item">ไม่มีประเภทกีฬา</li>
            )}
          </ul>
        )}
      </div>
 
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหาสนามกีฬา / สถานที่"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Link href={`/Homepage/Search?query=${encodeURIComponent(searchText)}`}>
          <img src="/picturemild/Find.png" alt="Find" className="find" />
        </Link>
      </div>
    </nav>
  );
}
 