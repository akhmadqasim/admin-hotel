"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Utility to parse date safely
const getSafeDate = (input: string | Date): Date | null => {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
};

const RekapPemasukanList = ({ data }) => {
    const [items] = useState(JSON.parse(data));
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState("Bulan");
    const [selectedYear, setSelectedYear] = useState("Tahun");
    const [selectedCategory, setSelectedCategory] = useState("Kategori");
    const [exportFormat, setExportFormat] = useState("excel");

    const itemsPerPage = 10;

    const months = [
        "Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const category = [
        "Kategori", "Rekap Biaya Makan", "Rekap Biaya Laundry", "Rekap Biaya Tambahan", "Rekap Biaya Reservasi",
    ];

    const uniqueYears = useMemo(() => {
        const years = items.map(item => {
            const date = getSafeDate(item.checkIn);
            return date ? date.getFullYear() : null;
        }).filter(Boolean);
        return ["Tahun", ...Array.from(new Set(years))];
    }, [items]);

    const filteredItems = useMemo(() => {
        const keyword = searchQuery.toLowerCase();

        return items
            .filter((item) => {
                const tanggal = getSafeDate(item.checkIn);
                const matchesKeyword = item.memberName.toLowerCase().includes(keyword);
                const matchesMonth = selectedMonth === "Bulan" || (tanggal && format(tanggal, "MMMM", { locale: id }) === selectedMonth);
                const matchesYear = selectedYear === "Tahun" || (tanggal && format(tanggal, "yyyy") === String(selectedYear));
                return matchesKeyword && matchesMonth && matchesYear;
            })
            .map((item) => {
                let harga = 0;
                switch (selectedCategory) {
                    case "Rekap Biaya Makan":
                        harga = Array.isArray(item.mealCost) ? item.mealCost.reduce((sum, cost) => sum + Number(cost), 0) : 0;
                        break;
                    case "Rekap Biaya Laundry":
                        harga = Array.isArray(item.laundryCost) ? item.laundryCost.reduce((sum, cost) => sum + Number(cost), 0) : 0;
                        break;
                    case "Rekap Biaya Tambahan":
                        harga = Array.isArray(item.otherCost) ? item.otherCost.reduce((sum, cost) => sum + Number(cost), 0) : 0;
                        break;
                    case "Rekap Biaya Reservasi":
                        harga = Number(item.price) || 0;
                        break;
                    default:
                        harga = (Number(item.laundryCost) || 0) +
                            (Number(item.mealCost) || 0) +
                            (Number(item.otherCost) || 0) +
                            (Number(item.price) || 0);
                        break;
                }
                return { ...item, harga };
            });
    }, [items, searchQuery, selectedMonth, selectedYear, selectedCategory]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalHarga = filteredItems.reduce((sum, item) => sum + Number(item.harga || 0), 0);

    const exportData = filteredItems.map((res) => {
        const tanggalCheckIn = getSafeDate(res.checkIn);
        const tanggalCheckOut = getSafeDate(res.checkOut);

        return {
            "Nama Member": res.memberName,
            "Tanggal Check-In": tanggalCheckIn ? format(tanggalCheckIn, "dd-MM-yyyy") : "-",
            "Tanggal Check-Out": tanggalCheckOut ? format(tanggalCheckOut, "dd-MM-yyyy") : "-",
            "Harga": res.harga,
            "Kategori": selectedCategory === "Kategori" ? "Total" : selectedCategory.replace("Rekap Biaya ", "")
        };
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "rekap_pemasukan.xlsx");
    };

    const exportToCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "rekap_pemasukan.csv");
    };

    // Handle Export based on format
    const handleExport = () => {
        if (exportFormat === "excel") {
            exportToExcel();
        } else {
            exportToCSV();
        }
    };

    const shouldShowJenis = ["Rekap Biaya Makan", "Rekap Biaya Laundry", "Rekap Biaya Tambahan"].includes(selectedCategory);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <form className="navbar-search">
                    <input
                        type="text"
                        className="bg-base h-40-px w-auto"
                        name="search"
                        placeholder="Cari Nama Member"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Icon icon="ion:search-outline" className="icon" />
                </form>
            </div>

            <div className="card-body p-24">
                <div className="d-flex gap-3 flex-wrap mb-3">
                    <select
                        className="form-select w-auto"
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {months.map((month, i) => (
                            <option key={i} value={month}>{month}</option>
                        ))}
                    </select>

                    <select
                        className="form-select w-auto"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {uniqueYears.map((year, i) => (
                            <option key={i} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        className="form-select w-auto"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        {category.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        className="form-select w-auto"
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                    >
                        <option value="excel">Excel (.xlsx)</option>
                        <option value="csv">SPSS / CSV (.csv)</option>
                    </select>

                    <button onClick={handleExport} className="btn btn-success fw-semibold">
                        <Icon icon="mdi:export-variant" className="me-2" />
                        Export
                    </button>
                </div>

                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table mb-0 ">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Member</th>
                            <th>Tanggal Check-In</th>
                            <th>Tanggal Check-Out</th>
                            {shouldShowJenis && <th>Jenis</th>}
                            <th>{selectedCategory === "Kategori" ? "Total Keseluruhan" : "Harga"}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((res, index) => {
                                const tanggalObj = getSafeDate(res.checkIn);
                                let jenis = "-";
                                if (selectedCategory === "Rekap Biaya Makan") {
                                    jenis = Array.isArray(res.mealType) ? res.mealType.join(", ") : "-";
                                } else if (selectedCategory === "Rekap Biaya Laundry") {
                                    jenis = Array.isArray(res.laundryType) ? res.laundryType.join(", ") : "-";
                                } else if (selectedCategory === "Rekap Biaya Tambahan") {
                                    jenis = Array.isArray(res.otherType) ? res.otherType.join(", ") : "-";
                                }
                                console.log("jenis", jenis);

                                return (
                                    <tr key={res.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{res.memberName}</td>
                                        <td>{tanggalObj ? format(tanggalObj, "dd-MM-yyyy") : "-"}</td>
                                        <td>{res.checkOut ? format(getSafeDate(res.checkOut), "dd-MM-yyyy") : "-"}</td>
                                        {shouldShowJenis && <td>{jenis}</td>}
                                        <td>Rp {(res.harga ?? 0).toLocaleString("id-ID")}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={shouldShowJenis ? 6 : 5} className="text-center text-muted">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                        {paginatedItems.length > 0 && (
                            <tr className="font-semibold bg-neutral-100">
                                <td colSpan={shouldShowJenis ? 5 : 4}>Total Pemasukan</td>
                                <td>Rp {totalHarga.toLocaleString("id-ID")}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>


                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                  <span>
                    Menampilkan {paginatedItems.length} dari {filteredItems.length} entri
                  </span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <button
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <Icon icon="ep:d-arrow-left" />
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li className="page-item" key={i}>
                                <button
                                    className={`page-link ${currentPage === i + 1
                                        ? "bg-primary-600 text-white"
                                        : "bg-neutral-200 text-secondary-light"
                                    } fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <Icon icon="ep:d-arrow-right" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RekapPemasukanList;
