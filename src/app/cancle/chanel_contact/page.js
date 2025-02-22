"use client";

import "./chanel.css";
import { useState } from "react";
import Tabbar from "../../Tab/tab";
import Link from "next/link";

export default function ChanelContact() {
    const [nameInput, setNameInput] = useState("");
    const [bankInput, setBankInput] = useState("");
    const [accountInput, setAccountInput] = useState("");
    const [fileName, setFileName] = useState("");
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFileName(selectedFile.name);
            setIsFileUploaded(true);
        }
    };

    const handleConfirmClick = (event) => {
        if (!nameInput || !bankInput || !accountInput || !isFileUploaded) {
            event.preventDefault(); // ป้องกันการเปลี่ยนหน้า
            setShowWarning(true);
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

                    <div className="form-group">
                        <label className="upload-label"></label>
                        <div 
                            className="upload-box"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <span className="upload-icon">+</span>
                            <p style={{ fontSize: 15, color: "#ccc" }} className="upload-text">
                                {fileName || "เพิ่มไฟล์หน้าสมุดบัญชี"}
                            </p>
                        </div>
                        {isFileUploaded && (
                            <p className="upload-success-text" style={{ color: "green", fontSize: "14px", marginTop: "8px" }}>
                                อัปโหลดรูปสำเร็จ: {fileName}
                            </p>
                        )}
                    </div>

                    {showWarning && (
                        <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
                            *กรุณาใส่ข้อมูลให้ครบถ้วน
                        </p>
                    )}

                    <div className="button-group">
                        <Link href="/cancle" passHref>
                            <button className="cancel-btn">ยกเลิก</button>
                        </Link>

                        <Link
                            href={nameInput && bankInput && accountInput && isFileUploaded ? "/cancle" : "#"}
                            passHref
                            onClick={handleConfirmClick}
                        >
                            <button className="confirm-btn">ยืนยัน</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
