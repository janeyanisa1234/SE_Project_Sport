"use client";

import { useState, useEffect } from "react";
import "./Search.css";
import Link from "next/link";
import Tabbar from "../../Tab/tab";
import Headfunction from "../../Headfunction/page";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function SearchPlace() {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const promoted = searchParams.get("promoted") === "true";

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        let url = "http://localhost:5000/booking/stadiums";
        if (promoted) {
          console.log("Fetching promoted stadiums...");
          url = "http://localhost:5000/booking/promoted-stadiums";
        } else if (category) {
          const decodedCategory = decodeURIComponent(category);
          console.log("Fetching filtered stadiums for category:", decodedCategory);
          url = `http://localhost:5000/booking/filtered-stadiums?sportType=${encodeURIComponent(decodedCategory)}`;
        }

        const response = await axios.get(url, { timeout: 10000 });
        console.log("📌 Data from API:", response.data);

        if (response.data && response.data.length > 0) {
          setPlaceData(response.data);
        } else {
          console.warn("No place data received or empty array");
          setPlaceData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          console.log("Response Status:", error.response.status);
          setError(`เกิดข้อผิดพลาด: ${error.response.data.error || error.message}`);
        } else {
          setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
        setPlaceData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaceData();
  }, [category, promoted]);

  const filteredPlaces = placeData.filter(place =>
    (place.stadium_name || "").toLowerCase().includes(query.toLowerCase()) ||
    (place.stadium_address || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
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
                    {place.promotion && (
                      <p className="place-promo">
                        ส่วนลด: {place.promotion.discount_percentage}%
                      </p>
                    )}
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