"use client";
import "./tab.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';

export default function Tabbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <h1 className="tabbar">
        <img
          src="/pictureAdmin/Hamburger.svg"
          alt="Hamburger"
          className="hamburgur"
          onClick={toggleSidebar} 
        />
        <Link href="/Homeadmin" passHref>
          <img src="/pictureAdmin/Home.svg" alt="Home" className="home" />
        </Link>
        SPORTFLOW
      </h1>


      </>
  )
}

