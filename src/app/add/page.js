"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tabbar from "../components/tab";

import "./add.css";

export default function Home() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (event) => {
    setSelectedCount((prevCount) =>
      event.target.checked ? prevCount + 1 : prevCount - 1
    );
  };

  const handleConfirm = () => {
    router.push("/create-promotion");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Header */}
      <Tabbar />

      <div className="header-title">
        <h1>เพิ่มกีฬา</h1>
      </div>

      <div className="container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>เลือก</th>
                <th>ประเภทกีฬา</th>
                <th>ราคา</th>
                <th>ราคา (หลังหักส่วนลด)</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "แบดมินตัน",
                  price: 150,
                  discountPrice: 135,
                  image: "/pictureowner/badminton.png",
                },
                {
                  name: "ปิงปอง",
                  price: 120,
                  discountPrice: 108,
                  image: "/pictureowner/pingpong.png",
                },
                {
                  name: "ฟุตซอล",
                  price: 300,
                  discountPrice: 270,
                  image: "/pictureowner/futsal.png",
                },
                {
                  name: "ฟุตบอล",
                  price: 1300,
                  discountPrice: 1170,
                  image: "/pictureowner/football.png",
                },
              ].map((sport, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`} // เพิ่ม id ให้แต่ละ checkbox
                      name={`checkbox-${index}`} // เพิ่ม name ให้แต่ละ checkbox
                      onChange={handleCheckboxChange}
                    />
                  </td>
                  <td className="sport-cell">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="sport-icon"
                    />
                    <span>{sport.name}</span>
                  </td>
                  <td>฿{sport.price}</td>
                  <td>฿{sport.discountPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bottom-bar">
          <p>{selectedCount} เลือกแล้ว</p>
          <button className="confirm-button" onClick={handleConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
