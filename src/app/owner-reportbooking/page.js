"use client";

import React, { useState } from 'react';
import { Calendar, Filter, Download, Search, Menu, Home } from 'lucide-react';
import Image from "next/image";
import Tabbar from "../components/tab";
import "./dash.css";
import { useRouter } from "next/navigation";
//import "./slidebar.css";

const BookingReport = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [sportTypeFilter, setSportTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.classList.toggle("sidebar-open", !isSidebarOpen);
  };

  const bookingData = [
    {
      date: '2024-02-15',
      time: '14:30',
      sportType: 'แบดมินตัน',
      customer: 'John Doe',
      price: '฿500.00',
      status: 'ยืนยันแล้ว',
      courtNumber: 'A1'
    },
    {
      date: '2024-02-16',
      time: '19:00',
      sportType: 'ฟุตบอล',
      customer: 'Jane Smith',
      price: '฿1200.00',
      status: 'รอดำเนินการ',
      courtNumber: 'F3'
    },
    {
      date: '2024-02-17',
      time: '16:45',
      sportType: 'บาสเกตบอล',
      customer: 'Mike Johnson',
      price: '฿800.00',
      status: 'ยืนยันแล้ว',
      courtNumber: 'B2'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ยืนยันแล้ว':
        return 'text-green-600 bg-green-100';
      case 'รอดำเนินการ':
        return 'text-yellow-600 bg-yellow-100';
      case 'ยกเลิก':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBookings = bookingData.filter(booking => 
    booking.sportType.toLowerCase().includes(sportTypeFilter.toLowerCase()) &&
    booking.date.includes(dateFilter) &&
    (statusFilter === '' || booking.status === statusFilter)
  );

  // Summary data for the small cards
  const summaryData = {
    totalBookings: filteredBookings.length,
    totalRevenue: filteredBookings.reduce((sum, booking) => 
      sum + parseFloat(booking.price.replace('฿', '')), 0
    ),
    confirmedBookings: filteredBookings.filter(b => b.status === 'ยืนยันแล้ว').length
  };

  return (
    <div className="min-h-screen bg-[rgb(207,206,206)]">
     
     {/* Main Content */}
     <div className="transition-all duration-300">
        <Tabbar/>

        <br></br><br></br>
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">การจองทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryData.totalBookings}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">รายได้รวม</p>
                  <p className="text-2xl font-bold text-green-600">฿{summaryData.totalRevenue}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">ยืนยันแล้ว</p>
                  <p className="text-2xl font-bold text-purple-600">{summaryData.confirmedBookings}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Filter className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ค้นหาประเภทกีฬา" 
                  value={sportTypeFilter}
                  onChange={(e) => setSportTypeFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg pl-10"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">สถานะทั้งหมด</option>
                <option value="ยืนยันแล้ว">ยืนยันแล้ว</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
                ส่งออกรายงาน
              </button>
            </div>
          </div>

          {/* Booking Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">เวลา</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">ประเภทกีฬา</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">สนาม</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                  <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">ราคา</th>
                  <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">{booking.date}</td>
                    <td className="p-4 whitespace-nowrap">{booking.time}</td>
                    <td className="p-4 whitespace-nowrap">{booking.sportType}</td>
                    <td className="p-4 whitespace-nowrap">{booking.courtNumber}</td>
                    <td className="p-4 whitespace-nowrap">{booking.customer}</td>
                    <td className="p-4 whitespace-nowrap text-right">{booking.price}</td>
                    <td className="p-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReport;