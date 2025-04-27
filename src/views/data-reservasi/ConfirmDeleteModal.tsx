"use client";
import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Hapus Data", description = "Apakah Anda yakin ingin menghapus data ini?" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block"
             tabIndex={-1}
             style={{ backgroundColor: "rgba(0,0,0,0.5)"}}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{description}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
