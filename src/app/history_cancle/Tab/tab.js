"use client"; 

import "./tabbar.css";
import React, { useState } from "react";
import "../hamburgur/slidebar.css"
import Slidebar from "../hamburgur/slidebar.js"
import Link from "next/link";

export default function Tab() {

const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
 
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  


  
  return (
  <>

  <Slidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
  
    <div>
      <h1 className="tabbar">
        <img src="/hambur.jpg" alt="Hamburger" className="hamburgur" onClick={() => setIsSidebarOpen(true)} /> 
        
        <Link href="/">
          <img src="/home.jpg" alt="Home" className ="home" />
        </Link>
        
        
        SPORTFLOW 
      </h1>
      
    </div>
    </>
    
  );
}
