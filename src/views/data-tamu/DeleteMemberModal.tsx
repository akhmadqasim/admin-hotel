import React, { useState } from "react";

const DeleteMemberModal = ({ isOpen, onClose, member, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm(member.id);
        } catch (error) {
            console.error("Failed to delete member:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content rounded-4 shadow-lg">
                    <div className="modal-header bg-light rounded-top-4">
                        <h5 className="modal-title">Konfirmasi Hapus</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            Apakah kamu yakin ingin menghapus <strong>{member.name}</strong>?
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Batal
                        </button>
                        <button className="btn btn-danger" onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Menghapus...
                                </>
                            ) : (
                                'Hapus Member'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteMemberModal;