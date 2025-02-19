"use client";

import "./chanel.css";
import { useState } from "react";
import Tabbar from "../../Tab/tab";
import Link from "next/link";

export default function ChanelContact() {
    const [nameInput, setNameInput] = useState("");
    const [bankInput, setBankInput] = useState("");
    const [accountInput, setAccountInput] = useState("");
    const [bookImage, setBookImage] = useState(null); // เก็บไฟล์รูปภาพที่อัปโหลด

    // ฟังก์ชันสำหรับอัปโหลดรูปภาพ
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBookImage(URL.createObjectURL(file)); // แสดงตัวอย่างรูป
        }
    };

    return (
        <>
            <Tabbar />

            <div className="container">
                <div className="from-box">
                    <h2 className="chanel">ช่องทางการคืนเงิน</h2>

                    <div className="input-group">
                        <label>ชื่อ - สกุล</label>
                        <input
                            type="text"
                            placeholder="กรุณากรอกชื่อ-สกุล"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>ธนาคาร</label>
                        <input
                            type="text"
                            placeholder="กรุณากรอกชื่อธนาคาร"
                            value={bankInput}
                            onChange={(e) => setBankInput(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>เลขที่บัญชี</label>
                        <input
                            type="text"
                            placeholder="กรุณากรอกเลขที่บัญชี"
                            value={accountInput}
                            onChange={(e) => setAccountInput(e.target.value)}
                        />
                    </div>

                    {/* ส่วนอัปโหลดรูปหน้าสมุดบัญชี */}
                    <div className="book">
                        <label>หน้าสมุดบัญชี</label>
                        <div className="upload-box">
                            <input type="file" accept="image/*" id="upload" onChange={handleImageUpload} hidden />
                            <label htmlFor="upload" className="upload-label">
                                {bookImage ? (
                                    <img src={bookImage} alt="Preview" className="preview-image" />
                                ) : (
                                    <span className="plus-icon">+</span>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="button-group">
                        <Link href="/history_cancle/cancle" passHref>
                            <button className="cancel-btn">ยกเลิก</button>
                        </Link>

                        <Link href="/history_cancle/detail" passHref>
                            <button className="confirm-btn">ยืนยัน</button>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    );
}
