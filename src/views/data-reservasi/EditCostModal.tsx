"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditCostModal = ({ isOpen, onClose, data, dataType, reservationId, onSuccess }) => {
    const [typeField, setTypeField] = useState("");
    const [costField, setCostField] = useState("");

    useEffect(() => {
        if (data) {
            setTypeField(data[dataType === "meal" ? "mealType" : dataType === "laundry" ? "laundryType" : "costName"] || "");
            setCostField(data[dataType === "meal" ? "mealCost" : dataType === "laundry" ? "laundryCost" : "costAmount"]?.toString() || "");
        }
    }, [data, dataType]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            if (!response.ok) {
                throw new Error("Gagal update data");
            }

            toast.success("Data berhasil diperbarui!");

            const updatedItem = {
                ...data,
                ...payload,
            };

            onSuccess(updatedItem);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui data");
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
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                            <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCostModal;
