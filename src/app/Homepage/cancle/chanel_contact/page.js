"use client";

import "./chanel.css";
import { useState, useEffect } from "react";
import Tabbar from "../../../Tab/tab";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // เพิ่ม useRouterimport axios from "axios";
import axios from "axios";


export default function ChanelContact() {
  const [nameInput, setNameInput] = useState("");
  const [bankInput, setBankInput] = useState("");
  const [accountInput, setAccountInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({}); // เก็บข้อผิดพลาดของแต่ละช่อง
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const reasonsFromQuery = searchParams.get("reasons");
  const token = localStorage.getItem("token");
  const router = useRouter(); // กำหนด router

  useEffect(() => {
    if (reasonsFromQuery) {
      setReasonInput(decodeURIComponent(reasonsFromQuery));
    }
  }, [reasonsFromQuery]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, file: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" }));
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "ขนาดไฟล์ต้องไม่เกิน 5MB" }));
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateInputs = () => {
    const newErrors = {};

    // ตรวจสอบชื่อ-สกุล (ต้องเป็น string และไม่ว่าง)
    if (!nameInput || typeof nameInput !== "string" || nameInput.trim() === "") {
      newErrors.name = "กรุณากรอกชื่อ-สกุลให้ถูกต้อง";
    }

    // ตรวจสอบชื่อธนาคาร (ต้องเป็น string และไม่ว่าง)
    if (!bankInput || typeof bankInput !== "string" || bankInput.trim() === "") {
      newErrors.bank = "กรุณากรอกชื่อธนาคารให้ถูกต้อง";
    }

    // ตรวจสอบเลขบัญชี (ต้องเป็นตัวเลขเท่านั้นและไม่ว่าง)
    if (!accountInput || !/^\d+$/.test(accountInput)) {
      newErrors.account = "กรุณากรอกเลขบัญชีเป็นตัวเลขเท่านั้น";
    }

    // ตรวจสอบเหตุผล (ต้องเป็น string และไม่ว่าง)
    if (!reasonInput || typeof reasonInput !== "string" || reasonInput.trim() === "") {
      newErrors.reason = "กรุณากรอกเหตุผลให้ถูกต้อง";
    }

    // ตรวจสอบไฟล์ (ต้องมีไฟล์)
    if (!file) {
      newErrors.file = "กรุณาอัปโหลดหน้าสมุดบัญชี";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มีข้อผิดพลาด
  };

  const handleConfirmClick = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return; // หยุดถ้าข้อมูลไม่ถูกต้องหรือไม่ครบ
    }

    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("name", nameInput);
    formData.append("bank", bankInput);
    formData.append("account_number", accountInput);
    formData.append("reasoncancle", reasonInput);
    formData.append("bankimges", file);

    try {
      const response = await axios.post("http://localhost:5000/cancle/refund", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("ข้อมูลที่ส่งไป backend:", response.data);
      alert("ส่งข้อมูลสำเร็จ!");
      router.push(`/Homepage`);

    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("ไม่สามารถส่งข้อมูลได้: " + (error.response?.data?.error || error.message));
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
            {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}
          </div>
          <div className="input-group">
            <label>ธนาคาร</label>
            <input
              type="text"
              placeholder="กรุณากรอกชื่อธนาคาร"
              value={bankInput}
              onChange={(e) => setBankInput(e.target.value)}
            />
            {errors.bank && <p style={{ color: "red", fontSize: "12px" }}>{errors.bank}</p>}
          </div>
          <div className="input-group">
            <label>เลขที่บัญชี</label>
            <input
              type="text"
              placeholder="กรุณากรอกเลขที่บัญชี"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
            />
            {errors.account && <p style={{ color: "red", fontSize: "12px" }}>{errors.account}</p>}
          </div>
          <div className="input-group">
            <label>เหตุผลการยกเลิก</label>
            <input
              type="text"
              placeholder="กรุณากรอกเหตุผลการยกเลิก"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
            {errors.reason && <p style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>}
          </div>
          <div className="form-group">
            <label className="upload-label">หน้าสมุดบัญชี</label>
            <div className="upload-box relative overflow-hidden">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Bookbank Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="upload-icon">+</span>
                  <p style={{ fontSize: 15, color: "#ccc" }} className="upload-text">
                    เพิ่มไฟล์หน้าสมุดบัญชี
                  </p>
                </div>
              )}
            </div>
            {errors.file && <p style={{ color: "red", fontSize: "12px" }}>{errors.file}</p>}
          </div>
          <div className="button-group">
            <Link href="/cancle" passHref>
              <button className="cancel-btn">ยกเลิก</button>
            </Link>
            <button className="confirm-btn" onClick={handleConfirmClick}>
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </>
  );
}