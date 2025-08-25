import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMemberModal = ({ isOpen, onClose, member, onSubmit }) => {
    const [formData, setFormData] = useState({
        code: "",
        nik: "",
        name: "",
        address: "",
        birthDate: "",
        birthPlace: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member) {
            setFormData({
                code: member.code || "",
                nik: member.nik || "",
                name: member.name?.toUpperCase() || "",
                address: member.address?.toUpperCase() || "",
                birthDate: member.birthDate?.slice(0, 10) || "",
                birthPlace: member.birthPlace?.toUpperCase() || "",
            });
        }
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "code") {
            const raw = value.replace(/\D/g, "");

            if (raw.length >= 3) {
                formattedValue = raw.slice(0, 2) + "/" + raw.slice(2, 4);
            } else {
                formattedValue = raw;
            }
        } else if (["name", "birthPlace", "address"].includes(name)) {
            formattedValue = value.toUpperCase();
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { code, nik, name, birthDate, birthPlace, address } = formData;
        
        if (!/^\d+$/.test(nik)) {
            toast.error("NIK hanya boleh angka!");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`/api/members/${member.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error("Gagal memperbarui member!");
                return;
            }

            toast.success("Member berhasil diperbarui!");
            onSubmit(result.member);
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Terjadi kesalahan saat mengirim data.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content rounded-4 shadow-lg">
                    <div className="modal-header bg-light rounded-top-4">
                        <h5 className="modal-title">Edit Member</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">Kode Member</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Kode Member"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">NIK</label>
                                <input
                                    type="number"
                                    name="nik"
                                    value={formData.nik}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan NIK"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Nama</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Nama"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Alamat"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tempat Lahir</label>
                                <input
                                    type="text"
                                    name="birthPlace"
                                    value={formData.birthPlace}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Tempat Lahir"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="form-label">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="form-control"
                                    disabled={isLoading}
                                />
                            </div>
                            <button type="submit" className="btn btn-warning mt-3" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMemberModal;
