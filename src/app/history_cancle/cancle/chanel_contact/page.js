"use client";

import "./chanel.css";
import { useState } from "react";
import Tabbar from "../../Tab/tab";
import Link from "next/link";


export default function ChanelContact() {
    const [nameInput, setNameInput] = useState("");
    const [bankInput, setBankInput] = useState("");
    const [accountInput, setAccountInput] = useState("");

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

                    <div className="button-group">
                    <Link href="/history_cancle/cancle" passHref>
                        <button className="cancel-btn">ยกเลิก</button>
                    </Link>

                    <Link href="/history_cancle/Bank_user" passHref>
                        <button className="confirm-btn">ยืนยัน</button>
                    </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
