"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const ReservasiDetailModal = ({ member, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    if (!member) return null;

    // Helper buat nge-sum field dari array
    const sumField = (arr, field) =>
        Array.isArray(arr) ? arr.reduce((acc, obj) => acc + (obj?.[field] || 0), 0) : 0;

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return member.reservations?.filter((res) => {
            const dateStr = new Date(res.checkIn).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const roomNumber = res.roomNumber?.toLowerCase() || "";
            const price = sumField(res.bookingPrice, "roomPrice").toString();
            return (
                dateStr.toLowerCase().includes(q) ||
                roomNumber.includes(q) ||
                price.includes(q)
            );
        }) || [];
    }, [member.reservations, searchQuery]);

    const totalHarga = filtered.reduce(
        (acc, curr) => acc + sumField(curr.bookingPrice, "roomPrice"),
        0
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
                    <div className="modal-header text-white">
                        <h5 className="modal-title">Riwayat Reservasi: {member.name}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari tanggal, harga, atau kamar"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {paginated.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: "400px" }}>
                                <table className="table table-hover align-middle">
                                    <thead className="sticky-top bg-light">
                                    <tr>
                                        <th className="text-center">No</th>
                                        <th>Nomor Kamar</th>
                                        <th>Check-In</th>
                                        <th>Check-Out</th>
                                        <th>Reservasi</th>
                                        <th>Makan</th>
                                        <th>Laundry</th>
                                        <th>Lainnya</th>
                                        <th>Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginated.map((res, idx) => {
                                        const roomPrice = sumField(res.bookingPrice, "roomPrice");
                                        const meal = sumField(res.mealCost, "mealCost");
                                        const laundry = sumField(res.laundryCost, "laundryCost");
                                        const other = sumField(res.otherCost, "costAmount");

                                        return (
                                            <tr key={res.id}>
                                                <td className="text-center">
                                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                                </td>
                                                <td><strong>{res.roomNumber}</strong></td>
                                                <td>{new Date(res.checkIn).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}</td>
                                                <td>{new Date(res.checkOut).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}</td>
                                                <td><span className="badge bg-success">Rp {roomPrice.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-info text-dark">Rp {meal.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-warning text-dark">Rp {laundry.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-secondary">Rp {other.toLocaleString("id-ID")}</span></td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => router.push(`/reservasi/${res.id}/edit`)}
                                                    >
                                                        Lihat / Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                    <tfoot className="sticky-bottom bg-light">
                                        <tr>
                                            <th colSpan="4" className="text-end">Total</th>
                                            <th className="text-start">Rp {totalHarga.toLocaleString("id-ID")}</th>
                                            <th className="text-start">Rp {
                                                filtered.reduce((acc, curr) => acc + sumField(curr.mealCost, "mealCost"), 0).toLocaleString("id-ID")
                                            }</th>
                                            <th className="text-start">Rp {
                                                filtered.reduce((acc, curr) => acc + sumField(curr.laundryCost, "laundryCost"), 0).toLocaleString("id-ID")
                                            }</th>
                                            <th className="text-start">Rp {
                                                filtered.reduce((acc, curr) => acc + sumField(curr.otherCost, "costAmount"), 0).toLocaleString("id-ID")
                                            }</th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-warning">Tidak ada hasil yang cocok.</div>
                        )}

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span>Halaman {currentPage} dari {totalPages}</span>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &lt; Sebelumnya
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Selanjutnya &gt;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservasiDetailModal;
