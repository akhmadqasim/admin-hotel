import React from "react";

const DeleteMemberModal = ({ isOpen, onClose, member, onConfirm }) => {
    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                        <button className="btn btn-secondary" onClick={onClose}>
                            Batal
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                onConfirm(member.id);
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteMemberModal;
