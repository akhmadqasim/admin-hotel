"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ReservasiDetailModal from "@/views/data-reservasi/ReservasiDetailModal";
import AddReservationModal from "@/views/data-reservasi/AddReservationModal";

const ReservasiList = ({ data }) => {
    const [members, setMembers] = useState(JSON.parse(data));
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddReservasiOpen, setIsAddReservasiOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredMembers = members.filter((member) => {
        const keyword = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(keyword) ||
            member.nik.toLowerCase().includes(keyword)
        );
    });

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openDetailModal = (member) => {
        setSelectedMember(member);
        setIsDetailOpen(true);
    };

    const openAddReservasiModal = (member) => {
        setSelectedMember(member);
        setIsAddReservasiOpen(true);
    };

    const handleAddReservasi = (newReservasi) => {
        setMembers((prev) =>
            prev.map((m) =>
                m.id === selectedMember.id
                    ? {
                        ...m,
                        reservations: [...(m.reservations || []), newReservasi],
                    }
                    : m
            )
        );
    };

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <form className="navbar-search">
                    <input
                        type="text"
                        className="bg-base h-40-px w-auto"
                        name="search"
                        placeholder="Cari Nama atau NIK"
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
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>NIK</th>
                            <th>Nama</th>
                            <th>Total Reservasi</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedMembers.length > 0 ? (
                            paginatedMembers.map((member, index) => (
                                <tr key={member.id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{member.nik}</td>
                                    <td>{member.name}</td>
                                    <td>{member.reservations?.length || 0}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <button
                                                className="btn btn-info btn-sm d-flex align-items-center gap-1"
                                                onClick={() => openDetailModal(member)}
                                            >
                                                <Icon icon="majesticons:eye-line" />
                                                Lihat Detail
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                                onClick={() => openAddReservasiModal(member)}
                                            >
                                                <Icon icon="ic:baseline-plus" />
                                                Tambah Reservasi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>
                        Menampilkan {paginatedMembers.length} dari {filteredMembers.length} entri
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

            {isDetailOpen && selectedMember && (
                <ReservasiDetailModal
                    member={selectedMember}
                    onClose={() => setIsDetailOpen(false)}
                />
            )}

            {isAddReservasiOpen && selectedMember && (
                <AddReservationModal
                    isOpen={isAddReservasiOpen}
                    onClose={() => setIsAddReservasiOpen(false)}
                    member={selectedMember}
                    onSubmit={handleAddReservasi}
                />
            )}
        </div>
    );
};

export default ReservasiList;
