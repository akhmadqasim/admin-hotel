import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReservationModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [form, setForm] = useState({ date: "", price: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || !form.price) {
            toast.error("Tanggal dan harga harus diisi");
            return;
        }

        const priceValue = parseInt(form.price);

        if (isNaN(priceValue) || priceValue <= 0) {
            toast.error("Harga harus lebih dari 0");
            return;
        }

        const payload = {
            date: form.date,
            price: priceValue,
            memberId: member.id,
        };

        setIsLoading(true);

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error("Gagal tambah reservasi");
                return;
            }

            onSubmit({ ...form, price: priceValue });
            setForm({ date: "", price: "" });
            toast.success("Berhasil menambahkan reservasi!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menyimpan reservasi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h6 className="modal-title">Tambah Reservasi {member.name}</h6>
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
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tanggal Menginap</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={form.date}
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
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Biaya Lainnya</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="othersCost"
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