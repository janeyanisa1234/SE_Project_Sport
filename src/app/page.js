"use client";
 
import { useState, useEffect } from "react";
import Tabbar from "../app/history_cancle/Tab/tab"
import "./globals.css";
 
 
 
export default function Home() {
 
 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
  const carouselImages = ["/picture.svg", "/Hit2.png", "/Hit3.png", "/Hit4.png"];
 
  // สลับภาพทุก 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
 
  return (
    <>
 
      <Tabbar/>
 
 
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
              { name: "SING STD", image: "/SingSTD.svg" },
              { name: "AVOCADO", image: "/Avocado.png" },
              { name: "MAREENONT", image: "/Mareenont.png" },
              { name: "ศรีราชาสปอร์ต", image: "/sriracha-sport.png" },
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
              { name: "ทัศนาสปอร์ต", image: "/ทัศนาสปอร์ต.png" },
              { name: "AVOCADO", image: "/avocado.png" },
              { name: "MAREENONT", image: "/mareenont.png" },
              { name: "SING STD", image: "/SingSTD.png" },
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