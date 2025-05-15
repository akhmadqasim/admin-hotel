import React from "react";

const MemberDetailModal = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) return null;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="modal show d-block" tabIndex={-1}  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h5 className="modal-title">Detail Member</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">NIK</label>
                                <p>{member.nik}</p>
                            </div>
                            <div>
                                <label className="form-label">Nama</label>
                                <p>{member.name}</p>
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <p>{member.address}</p>
                            </div>
                            <div>
                                <label className="form-label">Tempat Lahir</label>
                                <p>{member.birthPlace}</p>
                            </div>
                            <div>
                                <label className="form-label">Tanggal Lahir</label>
                                <p>{formatDate(member.birthDate)}</p>
                            </div>
                            <div>
                                <label className="form-label">Reservasi</label>
                                <p>{member._count?.reservations ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetailModal;