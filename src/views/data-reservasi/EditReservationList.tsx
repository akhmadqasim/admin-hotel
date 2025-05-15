"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

// Components
import AddDataMealModal from "@/views/data-reservasi/AddDataMealModal";
import AddDataLaundryModal from "@/views/data-reservasi/AddDataLaundryModal";
import AddDataOtherModal from "@/views/data-reservasi/AddDataOtherModal";
import ConfirmDeleteModal from "@/views/data-reservasi/ConfirmDeleteModal";
import EditCostModal from "@/views/data-reservasi/EditCostModal";

const EditReservationList = ({ reservation }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    };

    const [reservationData, setReservationData] = useState({
        ...reservation,
        checkIn: formatDate(reservation.checkIn),
        checkOut: formatDate(reservation.checkOut),
    });
    const [loading, setLoading] = useState(false);

    const [isAddDataMealOpen, setIsAddDataMealOpen] = useState(false);
    const [isAddDataLaundryOpen, setIsAddDataLaundryOpen] = useState(false);
    const [isAddDataOtherOpen, setIsAddDataOtherOpen] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const [editData, setEditData] = useState(null);
    const [editDataType, setEditDataType] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (item, type) => {
        setEditData(item);
        setEditDataType(type);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditData(null);
        setEditDataType(null);
        setIsEditModalOpen(false);
    };

    const openConfirmDelete = (target) => {
        setDeleteTarget(target);
        setIsConfirmDeleteOpen(true);
    };

    const closeConfirmDelete = () => {
        setDeleteTarget(null);
        setIsConfirmDeleteOpen(false);
    };

    const handleChange = (field, value) => {
        setReservationData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdateReservation = async () => {
        setLoading(true);
        try {
            const updateReservation = await fetch(`/api/reservations/${reservationData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomNumber: reservationData.roomNumber,
                    checkIn: reservationData.checkIn,
                    checkOut: reservationData.checkOut,
                    price: reservationData.price,
                }),
            });

            if (!updateReservation.ok) {
                throw new Error("Gagal memperbarui data reservasi");
            }

            toast.success("Data reservasi berhasil diperbarui!");
            window.location.reload();
        } catch (error) {
            toast.error("Gagal memperbarui data reservasi!");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await fetch(`/api/reservations/${reservationData.id}/${deleteTarget.type}-cost/${deleteTarget.id}`, {
                method: "DELETE",
            });

            setReservationData((prev) => ({
                ...prev,
                [`${deleteTarget.type}Cost`]: prev[`${deleteTarget.type}Cost`].filter(item => item.id !== deleteTarget.id),
            }));

            toast.success("Data berhasil dihapus!");
            closeConfirmDelete();
        } catch (error) {
            toast.error("Gagal menghapus data!");
        }
    };

    const handleAddLaundryData = (newLaundryData) => {
        setReservationData((prev) => ({
            ...prev,
            laundryCost: [...(prev.laundryCost || []), {
                laundryType: newLaundryData.laundryType,
                laundryCost: parseInt(newLaundryData.laundryCost, 10),
            }],
        }));
    };

    const handleAddMealData = (newMealData) => {
        setReservationData((prev) => ({
            ...prev,
            mealCost: [...(prev.mealCost || []), {
                mealType: newMealData.mealType,
                mealCost: parseInt(newMealData.mealCost, 10),
            }],
        }));
    };

    const handleAddOtherData = (newOtherData) => {
        setReservationData((prev) => ({
            ...prev,
            otherCost: [...(prev.otherCost || []), {
                costName: newOtherData.costName,
                costAmount: parseInt(newOtherData.costAmount, 10),
            }],
        }));
    };

    const handleEditData = (updatedItem) => {
        setReservationData((prev) => {
            const updatedData = prev[`${editDataType}Cost`].map(item =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            );
            return {
                ...prev,
                [`${editDataType}Cost`]: updatedData,
            };
        });
    };

    return (
        <div>
            {/* Data Reservasi */}
            <div className="row gy-4">
                <div className="w-full">
                    <div className="card shadow-sm">
                        <div className="card-header text-white d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Data Reservasi</h5>
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary d-flex align-items-center gap-1"
                                onClick={() => window.history.back()}
                            >
                                <Icon icon="mdi:arrow-left" className="me-2 " />
                                Kembali
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="row gy-3">
                                <InputWithIcon
                                    label="Nomor Kamar"
                                    icon="mdi:door-closed"
                                    value={reservationData.roomNumber || ""}
                                    onChange={(val) => handleChange("roomNumber", val)}
                                />
                                <InputWithIcon
                                    label="Check In"
                                    icon="mdi:calendar-range"
                                    type="date"
                                    value={reservationData.checkIn}
                                    onChange={(val) => handleChange("checkIn", val)}
                                />
                                <InputWithIcon
                                    label="Check Out"
                                    icon="mdi:calendar-range"
                                    type="date"
                                    value={reservationData.checkOut}
                                    onChange={(val) => handleChange("checkOut", val)}
                                />
                                <InputWithIcon
                                    label="Harga Reservasi"
                                    icon="mdi:cash-multiple"
                                    type="number"
                                    value={reservationData.price || ""}
                                    onChange={(val) => handleChange("price", parseInt(val, 10))}
                                />
                                <div className="col-12">
                                    <button
                                        type="button"
                                        className="btn btn-success w-100"
                                        onClick={handleUpdateReservation}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="row gy-4 mt-4">
                <HistoryCard
                    title="Riwayat Data Makan"
                    data={reservationData.mealCost}
                    typeField="mealType"
                    priceField="mealCost"
                    onAdd={() => setIsAddDataMealOpen(true)}
                    onDelete={(type, id) => openConfirmDelete({ type: "meal", id })}
                    dataType="meal"
                    onEdit={(item) => openEditModal(item, "meal")}
                />
                <HistoryCard
                    title="Riwayat Data Laundry"
                    data={reservationData.laundryCost}
                    typeField="laundryType"
                    priceField="laundryCost"
                    onAdd={() => setIsAddDataLaundryOpen(true)}
                    onDelete={(type, id) => openConfirmDelete({ type: "laundry", id })}
                    dataType="laundry"
                    onEdit={(item) => openEditModal(item, "laundry")}
                />
                <HistoryCard
                    title="Riwayat Data Tambahan"
                    data={reservationData.otherCost}
                    typeField="costName"
                    priceField="costAmount"
                    onAdd={() => setIsAddDataOtherOpen(true)}
                    onDelete={(type, id) => openConfirmDelete({ type: "other", id })}
                    dataType="other"
                    onEdit={(item) => openEditModal(item, "other")}
                />
            </div>

            {/* Modal */}
            {isEditModalOpen && (
                <EditCostModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    data={editData}
                    dataType={editDataType}
                    reservationId={reservationData.id}
                    onSuccess={handleEditData}
                />
            )}
            {isAddDataOtherOpen && (
                <AddDataOtherModal
                    isOpen={isAddDataOtherOpen}
                    onClose={() => setIsAddDataOtherOpen(false)}
                    reservationId={reservationData.id}
                    onSuccess={handleAddOtherData}
                />
            )}
            {isAddDataLaundryOpen && (
                <AddDataLaundryModal
                    isOpen={isAddDataLaundryOpen}
                    onClose={() => setIsAddDataLaundryOpen(false)}
                    reservationId={reservationData.id}
                    onSuccess={handleAddLaundryData}
                />
            )}
            {isAddDataMealOpen && (
                <AddDataMealModal
                    isOpen={isAddDataMealOpen}
                    onClose={() => setIsAddDataMealOpen(false)}
                    reservationId={reservationData.id}
                    onSuccess={handleAddMealData}
                />
            )}
            {isConfirmDeleteOpen && (
                <ConfirmDeleteModal
                    isOpen={isConfirmDeleteOpen}
                    onClose={closeConfirmDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

const InputWithIcon = ({ label, icon, placeholder = "", type = "text", value, onChange  }) => (
    <div className="col-12">
        <label className="form-label">{label}</label>
        <div className="input-group">
            <span className="input-group-text bg-light">
                <Icon icon={icon} />
            </span>
            <input
                type={type}
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

const HistoryCard = ({ title, data = [], typeField, priceField, onAdd, onDelete, dataType, onEdit }) => (
    <div className="col-md-4">
        <div className="card shadow-sm h-100">
            <div className="card-header text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{title}</h5>
                {onAdd && (
                    <button className="btn btn-sm btn-success" onClick={onAdd}>
                        <Icon icon="material-symbols:add" className="me-1" />
                        Tambah
                    </button>
                )}
            </div>
            <div className="card-body p-3">
                <div className="table-responsive">
                    <table className="table table-striped mb-0">
                        <thead>
                        <tr>
                            <th>Tipe</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td><strong>{item[typeField]}</strong></td>
                                    <td>
                                            <span className="badge bg-success">
                                                Rp {item[priceField]?.toLocaleString("id-ID")}
                                            </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(item)}>
                                            <Icon icon="material-symbols:edit" />
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(dataType, item.id)}>
                                            <Icon icon="mingcute:delete-2-line" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted">Belum ada data</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default EditReservationList;
