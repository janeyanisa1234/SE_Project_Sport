"use client";

import "./bar.css";
import React, { useState } from "react";
import Tabbar from "../Tab/tab.js";
import Link from "next/link";

export default function Detail() {
    const [currentStep, setCurrentStep] = useState(0); // กำหนดสถานะของขั้นตอน

    const steps = [
        "ยื่นคำขอยกเลิกการจอง",
        "คำขอได้รับการยอมรับ",
        "คืนเงินสำเร็จ",
    ];

    return (
        <>
            <Tabbar />
            <div style={{ marginLeft: 20 }}>
                <br />
                <h1 className="detail">
                    <Link href="../history_cancle/cancle">
                        <img src="/Arrow.png" alt="arrow" className="Arrow" />
                    </Link>
                    รายละเอียดการคืนเงิน
                </h1>

                {/* Progress Bar */}
                <div className="progress-container">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`progress-step ${
                                    index === currentStep
                                        ? "active"
                                        : index < currentStep
                                        ? "completed"
                                        : ""
                                }`}
                            ></div>
                            {index < steps.length - 1 && (
                                <div className="progress-line"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ชื่อของแต่ละขั้นตอน */}
                <div className="progress-labels">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`progress-text ${
                                index === currentStep ? "active" : ""
                            }`}
                        >
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
