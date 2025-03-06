"use client";

import "./Search.css";
import Link from "next/link";
import Tabbar from "../../Tab/tab";
import { useState, useEffect } from "react";
import Headfunction from "../../Headfunction/page";
import axios from "axios";
import { useSearchParams } from "next/navigation"; // ใช้เพื่อดึง query parameter

export default function PromotionPlace() {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); 
  const query = searchParams.get("query") || ""; // ดึงค่าค้นหาจาก URL

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        const response = await axios.get("http://localhost:5000/api/Booking/stadium");
        console.log("📌 Data from API:", response.data);

        if (response.data && response.data.length > 0) {
          setPlaceData(response.data);
        } else {
          console.error("No place data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaceData();
  }, []);

  // กรองข้อมูลสนามที่มีชื่อที่ตรงกับคำค้นหา
  const filteredPlaces = placeData.filter(place => 
    (place.stadium_name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place, index) => (
            <div key={place.id || index} className="place-card">
              <Link
                href={{
                  pathname: "/Homepage/Search/Select",
                  query: {
                    stadium_name: place.stadium_name,
                    stadium_address: place.stadium_address,
                  },
                }}
                className="place-card-link"
              >
                <div className="place-card-content">
                  <img
                    src={place.stadium_image || "/default-image.svg"}
                    alt={place.stadium_name || "Unknown"}
                    className="place-image"
                  />
                  <div className="place-info">
                    <h3 className="place-name">{place.stadium_name || "ไม่ระบุชื่อ"}</h3>
                  </div>
                </div>
              </Link>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.stadium_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="place-address"
              >
                {place.stadium_address || "ไม่พบที่อยู่"}
              </a>
            </div>
          ))
        ) : (
          <p>ไม่พบข้อมูลสถานที่ที่ตรงกับคำค้นหา</p>
        )}
      </main>
    </>
  );
}
