"use client";
import "./dash.css";
import "./slidebar.css";
import React, { useState } from "react"; 
import Sidebar from "./slidebar.js"; 
import Tab from "../Tabbar/page.js";
import { Pie } from "react-chartjs-2"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; 

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const pieData = {
    labels: ['ฟุตบอล', 'วอลเลย์บอล',  'แบดมินตัน'],  
    datasets: [
      {
        data: [200, 150, 100],  
        backgroundColor: ['#93B9DD', '#E4A0B7',  '#ADD88D'], 
        borderColor: '#fff', 
        borderWidth: 2, 
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    // กำหนดขนาดของกราฟ
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <Tab/>
      
      <br />
      <p className="summary">
        <img src="/pictureAdmin/iconG.svg" className="iconG" alt="icon" />
        สรุปผล
      </p>

      <div className="container3">
        <div className="box">
          <p style={{ color: "blue", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวนผู้ใช้งานทั้งหมด
        </div>
        <div className="box">
          <p style={{ color: "#1B9FEC", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวนผู้ประกอบการ
        </div>
        <div className="box">
          <p style={{ color: "#86FAC2", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          จำนวนผู้ใช้
        </div>
      </div>

      <div className="container2">
        <div className="box2">
          ประเภทของสนามกีฬาที่นิยมเป็นอันดับแรก
          <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="container3">
        <div className="box">
          <p style={{ color: "blue", fontWeight: "bold" }}>XXXX</p>
          จำนวนสนามกีฬาทั้งหมด
        </div>
        <div className="box">
          <p style={{ color: "#1B9FEC", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          รายได้รวมทั้งหมด
        </div>
        <div className="box">
          <p style={{ color: "#86FAC2", fontWeight: "bold" }}>XXXX</p>
          <p style={{ color: "red" }}>XX%</p>
          ค่าบริการแพลตฟอร์ม
        </div>
      </div>
    </>
  );
}