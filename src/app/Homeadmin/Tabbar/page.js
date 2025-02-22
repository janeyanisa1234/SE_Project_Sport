"use client";
import "./tab.css";
import "../Dashboard/slidebar.css";
import React, { useState } from "react";
import Sidebar from "../Dashboard/slidebar.js";
import Link from 'next/link';

export default function Tabbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [category, setCategory] = useState(""); // ค่าเริ่มต้นเพื่อป้องกัน hydration error
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <h1 className="tabbar">
        <img
          src="/pictureAdmin/Hamburger.svg"
          alt="Hamburger"
          className="hamburgur"
          onClick={() => setIsSidebarOpen(true)}
        />
        <Link href="/Homeadmin" passHref>
          <img src="/pictureAdmin/Home.svg" alt="Home" className="home" />
        </Link>
        SPORTFLOW
      </h1>


      </>
  )
}