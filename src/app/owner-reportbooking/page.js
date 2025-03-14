"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Search } from 'lucide-react';
import axios from 'axios';
import Tabbar from "../components/tab";
import * as XLSX from 'xlsx';
import "./dash.css";

const BookingReport = () => {
    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sportTypeFilter, setSportTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const getUserId = () => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            try {
                if (typeof storedUserId === 'string' && (storedUserId.startsWith('{') || storedUserId.startsWith('['))) {
                    const parsedUser = JSON.parse(storedUserId);
                    return parsedUser.id || parsedUser.userId || parsedUser.user_id || storedUserId;
                }
            } catch (e) {
                console.error("Error parsing stored userId:", e);
            }
            return storedUserId;
        }
        return null;
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userId = getUserId();
                if (!userId) {
                    throw new Error('User ID not found in localStorage');
                }

                const response = await axios.get('http://localhost:5000/reportbooking/api/reportbooking', {
                    params: { userId }
                });
                console.log('Backend Response:', response.data);

                const data = Array.isArray(response.data) ? response.data : [];
                setBookingData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Failed to load booking data. Please try again later.');
                setBookingData([]);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ยืนยัน':
                return 'text-green-600 bg-green-100';
            case 'รอดำเนินการยกเลิก':
                return 'text-yellow-600 bg-yellow-100';
            case 'ยกเลิกแล้ว':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const filteredBookings = Array.isArray(bookingData) ? bookingData.filter(booking =>
        booking.sportType?.toLowerCase().includes(sportTypeFilter.toLowerCase()) &&
        booking.date?.includes(dateFilter) &&
        (statusFilter === '' || booking.status === statusFilter)
    ) : [];

    const summaryData = {
        totalBookings: filteredBookings.length,
        totalRevenue: filteredBookings.reduce((sum, booking) => {
            const price = booking.price ? parseFloat(booking.price.replace('฿', '')) : 0;
            return sum + price;
        }, 0),
        confirmedBookings: filteredBookings.filter(b => b.status === 'ยืนยัน').length
    };

    const exportToExcel = async () => {
        try {
            setIsExporting(true);
            
            // Prepare the data for Excel
            const exportData = filteredBookings.map(booking => ({
                'วันที่': booking.date,
                'เวลา': booking.time,
                'ประเภทกีฬา': booking.sportType,
                'สนาม': booking.stadiumName,
                'ราคา': booking.price,
                'สถานะ': booking.status
            }));

            // Create a new workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Booking Report");

            // Customize column widths
            const wscols = [
                { wch: 15 }, // Date
                { wch: 15 }, // Time
                { wch: 20 }, // Sport Type
                { wch: 25 }, // Stadium
                { wch: 15 }, // Price
                { wch: 20 }  // Status
            ];
            ws['!cols'] = wscols;

            // Generate Excel file and trigger download
            XLSX.writeFile(wb, `Booking_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('เกิดข้อผิดพลาดในการส่งออกรายงาน');
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-600 p-4">{error}</div>;

    return (
        <div className="min-h-screen bg-[rgb(207,206,206)]">
            <div className="transition-all duration-300">
                <Tabbar />
                <br /><br />
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
                                    <p className="text-2xl font-bold text-green-600">฿{summaryData.totalRevenue.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Download className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ยืนยัน</p>
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
                                <option value="ยืนยัน">ยืนยัน</option>
                                <option value="รอดำเนินการยกเลิก">รอดำเนินการยกเลิก</option>
                                <option value="ยกเลิกแล้ว">ยกเลิกแล้ว</option>
                            </select>
                            <button 
                                onClick={exportToExcel}
                                disabled={isExporting}
                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center justify-center gap-2 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isExporting ? (
                                    'กำลังส่งออก...'
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        ส่งออกรายงาน
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">เวลา</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">ประเภทกีฬา</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">สนาม</th> 
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
                                        <td className="p-4 whitespace-nowrap">{booking.stadiumName}</td>
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