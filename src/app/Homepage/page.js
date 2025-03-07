"use client";

import { useState, useEffect } from "react";
import Headfunction from "../Headfunction/page.js";
import Tabbar from "../Tab/tab";
import Link from "next/link";
import "./Homepage.css";

export default function Home() {

  return (
    <>
      <Tabbar />
      <Headfunction />

      <main className="content">
        <div className="carousel">
        <Link href="/HowtoBooking">
          <img src="/picturemild/GuideToBooking.png" alt="Howto" className="Howto" />
        </Link>
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
          <Link href="/Homepage/PromotionPlace">
            <button className="view-more-button">ดูเพิ่มเติม</button>
          </Link>
        </section>

      </main>
    </>
  );
}
