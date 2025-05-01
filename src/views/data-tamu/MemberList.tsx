"use client";

// React
import React, { useState } from "react";

// Third-party
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

// Views
import AddMemberModal from "@/views/data-tamu/AddMemberModal";
import MemberDetailModal from "@/views/data-tamu/MemberDetailModal";
import EditMemberModal from "@/views/data-tamu/EditMemberModal";
import DeleteMemberModal from "@/views/data-tamu/DeleteMemberModal";

const MemberList = ({ data }) => {
    const [members, setMembers] = useState(JSON.parse(data));
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const handleAddMember = (newMember) => {
        setMembers([...members, newMember]);
    };

    const handleEditMember = (updatedMember) => {
        setMembers((prevMembers) =>
            prevMembers.map((member) => (member.id === updatedMember.id ? updatedMember : member))
        );
        setIsEditModalOpen(false);
        setSelectedMember(null);
    };

    const convertToDisplayFormat = (date) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleDeleteMember = async (id) => {
        try {
            const res = await fetch("api/members/" + id, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Berhasil menghapus member!");
                setMembers(prev => prev.filter(m => m.id !== id));
                setIsDeleteConfirmOpen(false);
                setMemberToDelete(null);
            } else {
                toast.error("Gagal menghapus member!");
            }
        } catch (error) {
            toast.error("Gagal menghapus member!");
        }
    };

    const filteredMembers = members.filter((member) => {
        const keyword = searchQuery.toLowerCase();
        const birthDate = new Date(member.birthDate).toLocaleDateString().toLowerCase();

        return (
            member.name.toLowerCase().includes(keyword) ||
            member.nik.toLowerCase().includes(keyword) ||
            member.birthPlace.toLowerCase().includes(keyword) ||
            birthDate.includes(keyword)
        );
    });

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <form className="navbar-search">
                    <input
                        type="text"
                        className="bg-base h-40-px w-auto"
                        name="search"
                        placeholder="Cari Nama, NIK, Tempat / Tgl Lahir"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Icon icon="ion:search-outline" className="icon" />
                </form>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
                    Tambah Member
                </button>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>NIK</th>
                            <th>Nama</th>
                            <th>Tanggal Lahir</th>
                            <th>Tempat Lahir</th>
                            <th>Reservasi</th>
                            <th className="text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedMembers.map((member, index) => (
                            <tr key={member.id}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{member.nik}</td>
                                <td>{member.name}</td>
                                <td>{convertToDisplayFormat(member.birthDate.slice(0, 10))}</td>
                                <td>{member.birthPlace}</td>
                                <td>{member._count?.reservations ?? 0}</td>
                                <td className="text-center">
                                    <div className="d-flex align-items-center gap-10 justify-content-center">
                                        <button
                                            type="button"
                                            className="bg-info-focus text-info-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                            onClick={() => setSelectedMember(member)}
                                        >
                                            <Icon icon="majesticons:eye-line" className="icon text-xl" />
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-success-focus text-success-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Icon icon="lucide:edit" className="menu-icon" />
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-danger-focus text-danger-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                            onClick={() => {
                                                setMemberToDelete(member);
                                                setIsDeleteConfirmOpen(true);
                                            }}
                                        >
                                            <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {paginatedMembers.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-muted">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>
                        Showing {paginatedMembers.length} of {filteredMembers.length} entries
                    </span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <button
                                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <Icon icon="ep:d-arrow-right" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMember}
                members={members}
            />

            <MemberDetailModal
                isOpen={!!selectedMember && !isEditModalOpen}
                onClose={() => setSelectedMember(null)}
                member={selectedMember}
            />

            <EditMemberModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setSelectedMember(null);
                    setIsEditModalOpen(false);
                }}
                member={selectedMember}
                onSubmit={handleEditMember}
            />

            <DeleteMemberModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setMemberToDelete(null);
                }}
                member={memberToDelete}
                onConfirm={handleDeleteMember}
            />
        </div>
    );
};

export default MemberList;