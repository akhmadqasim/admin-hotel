import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReservationModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [form, setForm] = useState({
        roomNumber: "",
        beginDate: "",
        endDate: "",
        price: "",
        mealCost: "",
        laundryCost: "",
        otherCost: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const formatDateToISOOffset = (dateInput) => {
        const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
        return date.toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.roomNumber || !form.beginDate || !form.price) {
            toast.error("Nomor kamar, tanggal mulai, dan harga harus diisi");
            return;
        }

        const priceValue = parseInt(form.price || "0");
        const meal = parseInt(form.mealCost || "0");
        const laundry = parseInt(form.laundryCost || "0");
        const others = parseInt(form.otherCost || "0");

        if (isNaN(priceValue) || priceValue <= 0) {
            toast.error("Harga harus lebih dari 0");
            return;
        }

        const start = new Date(form.beginDate);
        const end = form.endDate ? new Date(form.endDate) : new Date(form.beginDate);

        if (start > end) {
            toast.error("Tanggal akhir tidak boleh lebih awal dari tanggal mulai");
            return;
        }

        const reservations = [];
        let current = new Date(start);

        while (current <= end) {
            const copy = new Date(current);
            reservations.push({
                roomNumber: form.roomNumber,
                beginDate: formatDateToISOOffset(copy),
                endDate: formatDateToISOOffset(copy),
                price: priceValue,
                mealCost: meal,
                laundryCost: laundry,
                otherCost: others,
                memberId: member.id,
            });
            current.setDate(current.getDate() + 1);
        }

        setIsLoading(true);
        try {
            const responses = await Promise.all(
                reservations.map((resData) =>
                    fetch("/api/reservations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(resData),
                    })
                )
            );

            member._count = {
                reservations: member.reservations.length,
            };

            const hasError = responses.some((res) => !res.ok);

            if (hasError) {
                toast.error("Beberapa reservasi gagal ditambahkan");
            } else {
                toast.success("Semua reservasi berhasil ditambahkan!");
                onSubmit(reservations);
                setForm({
                    roomNumber: "",
                    beginDate: "",
                    endDate: "",
                    price: "",
                    mealCost: "",
                    laundryCost: "",
                    otherCost: "",
                });
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menyimpan reservasi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h6 className="modal-title">Tambah Reservasi untuk {member.name}</h6>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">Nomor Kamar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="roomNumber"
                                    value={form.roomNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tanggal Menginap</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="beginDate"
                                    value={form.beginDate}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tanggal Akhir Menginap</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Harga (Rp)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Biaya Makan</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="mealCost"
                                    value={form.mealCost}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Biaya Laundry</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="laundryCost"
                                    value={form.laundryCost}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Biaya Lainnya</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="otherCost"
                                    value={form.otherCost}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <button type="submit" className="btn btn-success mt-2" disabled={isLoading}>
                                {isLoading ? "Menambah..." : "Tambah Reservasi"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReservationModal;
