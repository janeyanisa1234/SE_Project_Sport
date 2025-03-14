"use client";
 
import Headfunction from "../../Headfunction/page";
import Tabbar from "../../components/tab";
import "./Hit.css";
import { useState } from "react";
 
export default function HitPage() {
  const [displayCount, setDisplayCount] = useState("");
  const [duration, setDuration] = useState("");
 
  const hitPlaces = [
    {
      name: "ทัศนาสปอร์ต",
      address: "127 หมู่ 10 ซอย12 บ้านเซน บางแสน จ.ชลบุรี",
      image: "/picturemild/Tasana.svg",
    },
    {
      name: "AVOCADO",
      address: "55/5 หมู่ 10 ซอย12 บ้านสวน จ.ชลบุรี",
      image: "/picturemild/Avocado.svg",
    },
    {
      name: "MAREENONT",
      address: "326 หมู่ 4 ถนนสุขุมวิท บางละมุง จ.ชลบุรี",
      image: "/picturemild/Mareenont.svg",
    },
    {
      name: "SING STD",
      address: "88/15 หมู่ 1 ถนนบ้านบึง จ.ชลบุรี",
      image: "/picturemild/Sing.svg",
    },
  ];
 
  const generateGoogleMapsLink = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
 
  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        <h3>สนามกีฬายอดนิยม</h3>
 
        <div className="dropdown-container">
          <select
            id="display-count"
            className="dropdown"
            value={displayCount}
            onChange={(e) => setDisplayCount(e.target.value)}
          >
            <option value="" disabled>จำนวนในการแสดง</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
 
          <select
            id="duration"
            className="dropdown"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="" disabled>ระยะเวลา</option>
            <option value="1">1 เดือน</option>
            <option value="3">3 เดือน</option>
            <option value="6">6 เดือน</option>
            <option value="12">12 เดือน</option>
          </select>
        </div>
 
        {hitPlaces.map((place, index) => (
          <div key={index} className="place-card">
            <img src={place.image} alt={place.name} className="place-image" />
            <div className="place-info">
              <h3 className="place-name">{place.name}</h3>
              <p className="place-address">
                <a style={{color: "black"}}href={generateGoogleMapsLink(place.address)} target="_blank" rel="noopener noreferrer">
                  {place.address}
                </a>
              </p>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}