import React, { useState } from "react";
import { toast } from "react-toastify";

const AddDataLaundryModal = ({ isOpen, onClose, reservationId, onSuccess }) => {
    const [form, setForm] = useState({
        laundryType: "",
        laundryCost: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {

        if (!form.laundryType || !form.laundryCost) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar.");
            return;
        }

        if (isNaN(Number(form.laundryCost)) || Number(form.laundryCost) < 0) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar dan harga tidak negatif.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/reservations/${reservationId}/laundry-cost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    laundryType: form.laundryType,
                    laundryCost: Number(form.laundryCost),
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menambahkan data laundry");
            }

            toast.success("Data laundry berhasil ditambahkan!");

            if (onSuccess) {
                onSuccess({
                    laundryType: form.laundryType,
                    laundryCost: Number(form.laundryCost),
                });
            }

            onClose();
            setForm({ laundryType: "", laundryCost: "" });
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan data laundry!");
        }
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Data Laundry</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="laundryType" className="form-label">Tipe Laundry</label>
                                <input
                                    type="text"
                                    id="laundryType"
                                    className="form-control"
                                    value={form.laundryType}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({ ...form, laundryType: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="laundryCost" className="form-label">Harga Laundry</label>
                                <input
                                    type="number"
                                    id="laundryCost"
                                    min="0"
                                    className="form-control"
                                    value={form.laundryCost}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({ ...form, laundryCost: e.target.value })}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Batal
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                'Tambah Data Laundry'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDataLaundryModal;
