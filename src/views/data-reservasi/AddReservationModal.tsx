import React, { useState } from "react";

const AddReservationModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [form, setForm] = useState({ date: "", price: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.date || !form.price) return;
        onSubmit({ ...form, price: parseInt(form.price) });
        setForm({ date: "", price: "" });
        onClose();
    };

    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h6 className="modal-title">Tambah Reservasi {member.name}</h6>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">Tanggal Menginap</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
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
                                />
                            </div>
                            <button type="submit" className="btn btn-success mt-2">Tambah Reservasi</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReservationModal;
