"use client";

import "./chanel.css";
import { useState, useEffect } from "react";
import Tabbar from "../../../Tab/tab";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ChanelContact() {
  const [nameInput, setNameInput] = useState("");
  const [bankInput, setBankInput] = useState("");
  const [accountInput, setAccountInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const reasonsFromQuery = searchParams.get("reasons");
  const token = localStorage.getItem("token");

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
    if (!nameInput || nameInput.trim() === "") newErrors.name = "กรุณากรอกชื่อ-สกุล";
    if (!bankInput || bankInput.trim() === "") newErrors.bank = "กรุณากรอกชื่อธนาคาร";
    if (!accountInput || !/^\d+$/.test(accountInput)) newErrors.account = "กรุณากรอกเลขบัญชีเป็นตัวเลข";
    if (!reasonInput || reasonInput.trim() === "") newErrors.reason = "กรุณากรอกเหตุผล";
    if (!file) newErrors.file = "กรุณาอัปโหลดหน้าสมุดบัญชี";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmClick = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

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
      alert("ส่งข้อมูลสำเร็จ!");
      router.push("/Homepage");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("ไม่สามารถส่งข้อมูลได้: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <>
    <Tabbar />
    <div className="container">
    <div className="form-box">
    <h2 className="chanel">ช่องทางการคืนเงิน</h2>
    <div className="input-group">
    <label>ชื่อ - สกุล</label>
    <input
    
                type="text"
    
                placeholder="กรุณากรอกชื่อ-สกุล"
    
                value={nameInput}
    
                onChange={(e) => setNameInput(e.target.value)}
    
              />
    
              {errors.name && <p className="error-message">{errors.name}</p>}
    </div>
    <div className="input-group">
    <label>ธนาคาร</label>
    <input
    
                type="text"
    
                placeholder="กรุณากรอกชื่อธนาคาร"
    
                value={bankInput}
    
                onChange={(e) => setBankInput(e.target.value)}
    
              />
    
              {errors.bank && <p className="error-message">{errors.bank}</p>}
    </div>
    <div className="input-group">
    <label>เลขที่บัญชี</label>
    <input
    
                type="text"
    
                placeholder="กรุณากรอกเลขที่บัญชี"
    
                value={accountInput}
    
                onChange={(e) => setAccountInput(e.target.value)}
    
              />
    
              {errors.account && <p className="error-message">{errors.account}</p>}
    </div>
    <div className="input-group">
    <label>เหตุผลการยกเลิก</label>
    <input
    
                type="text"
    
                placeholder="กรุณากรอกเหตุผลการยกเลิก"
    
                value={reasonInput}
    
                onChange={(e) => setReasonInput(e.target.value)}
    
              />
    
              {errors.reason && <p className="error-message">{errors.reason}</p>}
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
    <p className="upload-text">เพิ่มไฟล์หน้าสมุดบัญชี</p>
    </div>
    
                )}
    </div>
    
              {errors.file && <p className="error-message">{errors.file}</p>}
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