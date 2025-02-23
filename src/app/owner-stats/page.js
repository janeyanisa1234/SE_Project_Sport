"use client"

import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity, DollarSign, AlertCircle, Menu } from 'lucide-react';
import Image from "next/image";
import Tabbar from "../components/tab";
import "./dash.css";
import { useRouter } from "next/navigation";
//import "./slidebar.css";

const Dashboard = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const sportsData = [
    { name: 'แบดมินตัน', value: 41.6, revenue: 15000, color: '#FF6B8A' },
    { name: 'ฟุตบอล', value: 21.5, revenue: 12000, color: '#6BA5FF' },
    { name: 'วอลเลย์บอล', value: 13.7, revenue: 8000, color: '#2563EB' },
    { name: 'บาสเกตบอล', value: 11.6, revenue: 6000, color: '#48BB78' },
    { name: 'ปิงปอง', value: 7.4, revenue: 4000, color: '#8B5CF6' },
    { name: 'ฟุตซอล', value: 4.2, revenue: 2000, color: '#EAB308' }
  ];

  return (
    <div className="min-h-screen bg-[rgb(207,206,206)]">
       
{/* Main Content */}
<div className="transition-all duration-300">
  {/* Header */}
  <Tabbar/>

    <br></br><br></br>
        {/* Content Container */}
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <select className="w-full p-2 border rounded-lg bg-white shadow-sm">
              <option value="">เลือกวันที่</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select className="w-full p-2 border rounded-lg bg-white shadow-sm">
              <option value="">เดือน</option>
              {['มกราคม', 'กุมภาพันธ์', 'มีนาคม'].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            <select className="w-full p-2 border rounded-lg bg-white shadow-sm">
              <option value="">ปี พ.ศ.</option>
              {[2567, 2568, 2569].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">รายได้ทั้งหมด</p>
                  <p className="text-2xl font-bold text-green-600">฿47,000</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">อัตราการจอง</p>
                  <p className="text-2xl font-bold text-blue-600">87%</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">การยกเลิก</p>
                  <p className="text-2xl font-bold text-red-600">12</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">จัดอันดับประเภทสนามกีฬาที่นิยม</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sportsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {sportsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">รายได้จากกีฬาแต่ละประเภท</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sportsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4F46E5">
                      {sportsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;