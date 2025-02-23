// Search.js
"use client";

import "./Search-nologin.css";
import Link from "next/link";
import Tabbar from "../tabbar-nologin/tab";
import Headfunction from "../Headfunction/page";

export default function SearchPlacenologin() {
  const places = [
    {
      name: "AVOCADO",
      address: "55/5 หมู่ 10 ซอย 12 บ้านสวน จ.ชลบุรี",
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

  return (
    <>
      <Tabbar />
      <Headfunction />
      <main className="places-list">
        {places.map((place, index) => (
          <div key={index} className="place-card">
            <img src={place.image} alt={place.name} className="place-image" />
            <div className="place-info">
              <h3 className="place-name">{place.name}</h3>
              <a
                href={`https://www.google.com/maps/search/?q=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="place-address"
              >
                {place.address}
              </a>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
