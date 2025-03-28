import { useState } from "react";
import { toast } from "react-toastify";

const AddMemberModal = ({ isOpen, onClose, onSubmit, members }) => {
    const [formData, setFormData] = useState({
        nik: "",
        name: "",
        birthDate: "",
        birthPlace: "",
    });
    const [isLoading, setIsLoading] = useState(false);

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

        if (!formData.nik || !formData.name || !formData.birthDate || !formData.birthPlace ) {
            toast.error("Semua field wajib diisi!");
            return;
        }

        if (!/^\d+$/.test(formData.nik)) {
            toast.error("NIK hanya boleh angka!");
            return;
        }

        const isDuplicate = members.some((m) => m.nik === formData.nik);
        if (isDuplicate) {
            toast.error("NIK sudah terdaftar!");
            return;
        }

        const payload = {
            nik: formData.nik,
            name: formData.name,
            birthDate: formData.birthDate,
            birthPlace: formData.birthPlace,
        };

        setIsLoading(true);

        try {
            const res = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error || "Gagal menambahkan member.");
                return;
            }

            onSubmit(result.member);
            toast.success("Member berhasil ditambahkan!");

            setFormData({
                nik: "",
                name: "",
                birthDate: "",
                birthPlace: "",
            });

            onClose();
        } catch (error) {
            toast.error("Gagal mengirim data.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex={-1}  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h5 className="modal-title">Tambah Member</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">NIK</label>
                                <input name="nik" value={formData.nik} onChange={handleChange} className="form-control" placeholder="Masukkan NIK" />
                            </div>
                            <div>
                                <label className="form-label">Nama</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Masukkan Nama" />
                            </div>
                            <div>
                                <label className="form-label">Tempat Lahir</label>
                                <input name="birthPlace" value={formData.birthPlace} onChange={handleChange} className="form-control" placeholder="Masukkan Tempat Lahir" />
                            </div>
                            <div>
                                <label className="form-label">Tanggal Lahir</label>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-success mt-3" disabled={isLoading}>
                                {isLoading ? "Menambah..." : "Tambah"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
