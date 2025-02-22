"use client";

import { useState, useEffect } from "react";
import Headfunction from "./Headfunction/page.js";
import Tabbar from "./tabbar-nologin/tab.js";
import "./globals.css";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = ["/picturemild/Hit1.svg", "/picturemild/Promotion1.png", "/picturemild/Promotion2.png"];

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <>
      <Tabbar /> 
      <Headfunction />

      <main className="content">
        {/* Carousel */}
        <div className="carousel">
          <img src={carouselImages[currentImageIndex]} alt="Carousel" className="hit" />
        </div>

        {/* สนามที่เข้าร่วมโปรโมชั่น */}
        <section className="promotion-section">
          <h3>สนามที่เข้าร่วมโปรโมชั่น</h3>
          <div className="grid-container">
            {[
              { name: "SING STD", image: "/picturemild/Sing.svg" },
              { name: "AVOCADO", image: "/picturemild/Avocado.svg" },
              { name: "MAREENONT", image: "/picturemild/Mareenont.svg" },
              { name: "ศรีราชาสปอร์ต", image: "/picturemild/Sriracha.svg" },
            ].map((item, index) => (
              <div key={index} className="grid-item">
                <img src={item.image} alt={item.name} className="grid-image" />
                <p className="grid-title">{item.name}</p>
              </div>
            ))}
          </div>
          <button className="view-more-button">ดูเพิ่มเติม</button>
        </section>

        {/* อันดับสนามกีฬายอดนิยม */}
        <section className="popular-section">
          <h3>อันดับสนามกีฬายอดนิยม</h3>
          <div className="grid-container">
            {[
              { name: "ทัศนาสปอร์ต", image: "/picturemild/Tasana.svg" },
              { name: "AVOCADO", image: "/picturemild/Avocado.svg" },
              { name: "MAREENONT", image: "/picturemild/Mareenont.svg" },
              { name: "SING STD", image: "/picturemild/Sing.svg" },
            ].map((item, index) => (
              <div key={index} className="grid-item">
                <img src={item.image} alt={item.name} className="grid-image" />
                <p className="grid-title">{item.name}</p>
              </div>
            ))}
          </div>
          <button className="view-more-button">ดูเพิ่มเติม</button>
        </section>
      </main>
    </>
  );
}
