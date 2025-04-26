"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import AddDataMealModal from "@/views/data-reservasi/AddDataMealModal";
import AddDataLaundryModal from "@/views/data-reservasi/AddDataLaundryModal";
import AddDataOtherModal from "@/views/data-reservasi/AddDataOtherModal";

const EditReservationList = ({ reservation }) => {
    const [reservationData, setReservationData] = useState(reservation);
    const [isAddDataMealOpen, setIsAddDataMealOpen] = useState(false);
    const [isAddDataLaundryOpen, setIsAddDataLaundryOpen] = useState(false);
    const [isAddDataOtherOpen, setIsAddDataOtherOpen] = useState(false);

    const openAddDataOtherModal = () => {
        setIsAddDataOtherOpen(true);
    };

    const closeAddDataOtherModal = () => {
        setIsAddDataOtherOpen(false);
    };

    const openAddDataLaundryModal = () => {
        setIsAddDataLaundryOpen(true);
    }

    const closeAddDataLaundryModal = () => {
        setIsAddDataLaundryOpen(false);
    }

    const openAddDataMealModal = () => {
        setIsAddDataMealOpen(true);
    };

    const closeAddDataMealModal = () => {
        setIsAddDataMealOpen(false);
    };

    const handleChange = (field, value) => {
        setReservationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div>
            <div className="row gy-4">
                <div className="w-full">
                    <div className="card shadow-sm">
                        <div className="card-header text-white">
                            <h5 className="card-title mb-0">Data Reservasi</h5>
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
                                    value={reservationData.checkIn ? new Date(reservationData.checkIn).toISOString().slice(0, 10) : ""}
                                    onChange={(val) => handleChange("checkIn", val)}
                                />
                                <InputWithIcon
                                    label="Check Out"
                                    icon="mdi:calendar-range"
                                    type="date"
                                    value={reservationData.checkOut ? new Date(reservationData.checkOut).toISOString().slice(0, 10) : ""}
                                    onChange={(val) => handleChange("checkOut", val)}
                                />
                                <InputWithIcon
                                    label="Harga Reservasi"
                                    icon="mdi:cash-multiple"
                                    type="number"
                                    value={reservationData.bookingPrice?.[0]?.roomPrice || ""}
                                    onChange={(val) => handleChange("roomPrice", val)}
                                />
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success w-100">Simpan Perubahan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row gy-4 mt-4">
                <HistoryCard
                    title="Riwayat Data Makan"
                    data={reservationData.mealCost}
                    typeField="mealType"
                    priceField="mealCost"
                    onAdd={openAddDataMealModal}
                />
                <HistoryCard
                    title="Riwayat Data Laundry"
                    data={reservationData.laundryCost}
                    typeField="laundryType"
                    priceField="laundryCost"
                    onAdd={openAddDataLaundryModal}
                />
                <HistoryCard
                    title="Riwayat Data Lainnya"
                    data={reservationData.otherCost}
                    typeField="costName"
                    priceField="costAmount"
                    onAdd={openAddDataOtherModal}
                />
            </div>

            {isAddDataOtherOpen && (
                <AddDataOtherModal onClose={closeAddDataOtherModal} />
            )}

            {isAddDataLaundryOpen && (
                <AddDataLaundryModal onClose={closeAddDataLaundryModal} />
            )}

            {isAddDataMealOpen && (
                <AddDataMealModal onClose={closeAddDataMealModal} />
            )}
        </div>
    );
};

const InputWithIcon = ({ label, icon, placeholder = "", type = "text", value, onChange }) => (
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
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    </div>
);

const HistoryCard = ({ title, data = [], typeField, priceField, onAdd }) => (
    <div className="col-md-4">
        <div className="card shadow-sm h-100">
            <div className="card-header text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{title}</h5>
                {onAdd && (
                    <button
                        className="btn btn-sm btn-success"
                        onClick={onAdd}
                    >
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
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td><strong>{item[typeField]}</strong></td>
                                    <td>
                                        <span className="badge bg-success">
                                            Rp {item[priceField].toLocaleString("id-ID")}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            href='#'
                                            className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                                        >
                                            <Icon icon='lucide:edit' />
                                        </Link>
                                        <Link
                                            href='#'
                                            className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center'
                                        >
                                            <Icon icon='mingcute:delete-2-line' />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted">Tidak ada data</td>
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
