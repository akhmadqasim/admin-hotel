"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@/views/data-reservasi/ConfirmDeleteModal";

const DetailReservationModal = ({ member, onClose, onDelete}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [reservations, setReservations] = useState(member.reservations || []);

    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        setReservations(member.reservations || []);
    }, [member.reservations]);


    if (!member) return null;

    const openConfirmDelete = (reservationId) => {
        setDeleteTarget(reservationId);
        setIsConfirmDeleteOpen(true);
    };

    const closeConfirmDelete = () => {
        setDeleteTarget(null);
        setIsConfirmDeleteOpen(false);
    };

    const fetchUpdateReservations = async (reservationId) => {
        try {
            const response = await fetch(`/api/reservations/${reservationId}`);
            if (!response.ok) {
                throw new Error("Gagal mengambil data reservasi");
            }
            const data = await response.json();
            setReservations((prev) =>
                prev.map((res) => (res.id === reservationId ? { ...res, ...data } : res))
            );
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat memperbarui data reservasi!");
        }
    }

    const handleDeleteReservation = async (reservationId) => {
        try {
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Reservasi berhasil dihapus");
                setReservations((prev) => prev.filter((res) => res.id !== reservationId));
                if (onDelete) {
                    onDelete(reservationId);
                }
                closeConfirmDelete();
            } else {
                throw new Error("Gagal menghapus reservasi");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat menghapus reservasi!");
        }
    };

    const sumField = (arr, field) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((acc, obj) => acc + (Number(obj?.[field]) || 0), 0);
    };

    const filteredReservations = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return reservations.filter((res) => {
            const dateStr = new Date(res.checkIn).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const roomNumber = res.roomNumber?.toLowerCase() || "";
            const price = Number(res.price || 0).toString();
            return (
                dateStr.toLowerCase().includes(query) ||
                roomNumber.includes(query) ||
                price.includes(query)
            );
        });
    }, [reservations, searchQuery]);

    const totals = useMemo(() => {
        return filteredReservations.reduce(
            (acc, curr) => ({
                reservation: acc.reservation + Number(curr.price || 0),
                meal: acc.meal + sumField(curr.mealCost, "mealCost"),
                laundry: acc.laundry + sumField(curr.laundryCost, "laundryCost"),
                other: acc.other + sumField(curr.otherCost, "costAmount"),
            }),
            { reservation: 0, meal: 0, laundry: 0, other: 0 }
        );
    }, [filteredReservations]);

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

    const paginatedReservations = filteredReservations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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

                        {paginatedReservations.length > 0 ? (
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
                                    {paginatedReservations.map((res, idx) => {
                                        const price = Number(res.price || 0);
                                        const meal = sumField(res.mealCost, "mealCost");
                                        const laundry = sumField(res.laundryCost, "laundryCost");
                                        const other = sumField(res.otherCost, "costAmount");

                                        return (
                                            <tr key={res.id}>
                                                <td className="text-center">
                                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                                </td>
                                                <td><strong>{res.roomNumber}</strong></td>
                                                <td>{new Date(res.checkIn).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                                                <td>{new Date(res.checkOut).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                                                <td><span className="badge bg-success">Rp {price.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-success">Rp {meal.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-success">Rp {laundry.toLocaleString("id-ID")}</span></td>
                                                <td><span className="badge bg-success">Rp {other.toLocaleString("id-ID")}</span></td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => router.push(`/reservasi/${res.id}/edit`)}
                                                    >
                                                        Lihat / Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger ms-2"
                                                        onClick={() => openConfirmDelete(res.id)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                    <tfoot className="sticky-bottom bg-light text-nowrap">
                                    <tr>
                                        <th colSpan="4" className="text-end">Total</th>
                                        <th className="text-start">Rp {totals.reservation.toLocaleString("id-ID")}</th>
                                        <th className="text-start">Rp {totals.meal.toLocaleString("id-ID")}</th>
                                        <th className="text-start">Rp {totals.laundry.toLocaleString("id-ID")}</th>
                                        <th className="text-start">Rp {totals.other.toLocaleString("id-ID")}</th>
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

                    <ConfirmDeleteModal
                        isOpen={isConfirmDeleteOpen}
                        onClose={closeConfirmDelete}
                        onConfirm={() => {
                            if (deleteTarget) {
                                handleDeleteReservation(deleteTarget);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailReservationModal;
