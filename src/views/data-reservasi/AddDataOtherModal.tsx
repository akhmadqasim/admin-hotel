import React, { useState } from "react";
import { toast } from "react-toastify";

const AddDataOtherModal = ({ isOpen, onClose, reservationId, onSuccess }) => {
    const [form, setForm] = useState({
        costName: "",
        costAmount: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {

        if (!form.costName || !form.costAmount) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar.");
            return;
        }

        if (isNaN(Number(form.costAmount)) || Number(form.costAmount) < 0) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar dan harga tidak negatif.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/reservations/${reservationId}/other-cost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reservationId,
                    costName: form.costName,
                    costAmount: Number(form.costAmount),
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menambahkan data lainnya");
            }

            toast.success("Data lainnya berhasil ditambahkan!");

            if (onSuccess) {
                onSuccess({
                    costName: form.costName,
                    costAmount: Number(form.costAmount),
                });
            }

            onClose();
            setForm({ costName: "", costAmount: "" });
            window.location.reload();
        } catch (error) {
            toast.error("Gagal menambahkan data lainnya!");
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
                        <h5 className="modal-title">Tambah Data Lainnya</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="costName" className="form-label">Tipe Lainnya</label>
                                <input
                                    type="text"
                                    id="costName"
                                    className="form-control"
                                    value={form.costName}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({ ...form, costName: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="costAmount" className="form-label">Harga</label>
                                <input
                                    type="number"
                                    id="costAmount"
                                    min="0"
                                    className="form-control"
                                    value={form.costAmount}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({ ...form, costAmount: e.target.value })}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Tutup
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                'Tambah Data Tambahan'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDataOtherModal;
