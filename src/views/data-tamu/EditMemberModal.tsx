import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMemberModal = ({ isOpen, onClose, member, onSubmit }) => {
    const [formData, setFormData] = useState({
        nik: "",
        name: "",
        birthDate: "",
        birthPlace: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member) {
            setFormData({
                nik: member.nik || "",
                name: member.name || "",
                birthDate: member.birthDate?.slice(0, 10) || "", // format YYYY-MM-DD
                birthPlace: member.birthPlace || "",
            });
        }
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "birthPlace" || name === "name") {
            formattedValue = value.toUpperCase();
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nik || !formData.name || !formData.birthDate || !formData.birthPlace) {
            toast.error("Semua field wajib diisi!");
            return;
        }

        if (!/^\d+$/.test(formData.nik)) {
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
                toast.error(result.error || "Gagal mengupdate member.");
                return;
            }

            toast.success("Member berhasil diperbarui!");
            onSubmit(result.member);
            onClose();
        } catch (error) {
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
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">NIK</label>
                                <input
                                    name="nik"
                                    value={formData.nik}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan NIK"
                                />
                            </div>
                            <div>
                                <label className="form-label">Nama</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Nama"
                                />
                            </div>
                            <div>
                                <label className="form-label">Tempat Lahir</label>
                                <input
                                    name="birthPlace"
                                    value={formData.birthPlace}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Masukkan Tempat Lahir"
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
                                />
                            </div>
                            <button type="submit" className="btn btn-warning mt-3" disabled={isLoading}>
                                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMemberModal;