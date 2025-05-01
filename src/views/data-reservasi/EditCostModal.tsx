"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditCostModal = ({ isOpen, onClose, data, dataType, reservationId, onSuccess }) => {
    const [typeField, setTypeField] = useState("");
    const [costField, setCostField] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setTypeField(data[dataType === "meal" ? "mealType" : dataType === "laundry" ? "laundryType" : "costName"] || "");
            setCostField(data[dataType === "meal" ? "mealCost" : dataType === "laundry" ? "laundryCost" : "costAmount"]?.toString() || "");
        }
    }, [data, dataType]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const parsedCost = parseInt(costField, 10);

        if (!typeField || !costField || isNaN(parseInt(costField, 10))) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar.");
            return;
        }

        if (!typeField || !costField || isNaN(parsedCost) || parsedCost < 0) {
            toast.error("Data tidak valid. Pastikan semua field terisi dengan benar dan harga tidak negatif.");
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = `/api/reservations/${reservationId}/${dataType}-cost/${data.id}`;
            const payload = dataType === "meal"
                ? { reservationId, mealType: typeField, mealCost: parseInt(costField, 10) }
                : dataType === "laundry"
                    ? { reservationId, laundryType: typeField, laundryCost: parseInt(costField, 10) }
                    : { reservationId, costName: typeField, costAmount: parseInt(costField, 10) };

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Error response:", errorMessage);
                throw new Error("Gagal update data");
            }

            toast.success("Data berhasil diperbarui!");

            const updatedItem = {
                ...data,
                ...payload,
            };

            onSuccess(updatedItem);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui data");
        } finally {
            setIsLoading(false);
        }
    };


    const labelType = dataType === "meal" ? "Tipe Makanan" : dataType === "laundry" ? "Jenis Laundry" : "Nama Biaya";
    const labelCost = "Harga";

    return (
        <div className="modal show d-block"
             tabIndex={-1}
             style={{ backgroundColor: "rgba(0,0,0,0.5)"}}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit {labelType}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">{labelType}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={typeField}
                                    onChange={(e) => setTypeField(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{labelCost}</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={costField}
                                    onChange={(e) => setCostField(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>Batal</button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCostModal;
