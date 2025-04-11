import { useState } from "react";
import { toast } from "react-toastify";

const AddMemberModal = ({ isOpen, onClose, onSubmit, members }) => {
    const [formData, setFormData] = useState({
        nik: "",
        name: "",
        birthDate: "",
        birthPlace: "",
    });

    const [hasReservation, setHasReservation] = useState(false);
    const [reservationData, setReservationData] = useState({
        date: "",
        price: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setFormData({
            nik: "",
            name: "",
            birthDate: "",
            birthPlace: "",
        });
        setHasReservation(false);
        setReservationData({
            date: "",
            price: "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue =
            name === "name" || name === "birthPlace" ? value.toUpperCase() : value;

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleReservationChange = (e) => {
        const { name, value } = e.target;
        setReservationData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { nik, name, birthDate, birthPlace } = formData;

        if (!nik || !name || !birthDate || !birthPlace) {
            toast.error("Semua field wajib diisi!");
            return false;
        }

        if (!/^\d+$/.test(nik)) {
            toast.error("NIK hanya boleh berupa angka.");
            return false;
        }

        if (members.some((m) => m.nik === nik)) {
            toast.error("NIK sudah terdaftar.");
            return false;
        }

        if (hasReservation) {
            const { date, price } = reservationData;
            if (!date || !price) {
                toast.error("Tanggal dan harga reservasi wajib diisi.");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const priceValue = parseInt(reservationData.price);

        const payload = {
            ...formData,
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

            const member = result.member;

            if (hasReservation) {
                const reservationRes = await fetch("/api/reservations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        memberId: member.id,
                        date: reservationData.date,
                        price: priceValue,
                    }),
                });

                const reservationResult = await reservationRes.json();

                if (!reservationRes.ok) {
                    toast.error(reservationResult.error || "Reservasi gagal ditambahkan.");
                    return;
                }

                member.reservations = [reservationResult.reservation];
                member._count = { reservations: 1 };
            } else {
                member._count = { reservations: 0 };
            }

            onSubmit(member);
            toast.success("Member berhasil ditambahkan!");
            resetForm();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat mengirim data.");
        } finally {
            setIsLoading(false);
        }
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
                    <div className="modal-header text-white">
                        <h5 className="modal-title">Tambah Member</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            {/* Input Member */}
                            {[
                                { label: "NIK", name: "nik", placeholder: "Masukkan NIK" },
                                { label: "Nama", name: "name", placeholder: "Masukkan Nama" },
                                {
                                    label: "Tempat Lahir",
                                    name: "birthPlace",
                                    placeholder: "Masukkan Tempat Lahir",
                                },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="form-label">{field.label}</label>
                                    <input
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}

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

                            <div className="form-switch d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input cursor-pointer"
                                    type="checkbox"
                                    role="switch"
                                    id="hasReservation"
                                    checked={hasReservation}
                                    onChange={(e) => setHasReservation(e.target.checked)}
                                />
                                <label className="form-check-label mb-0 cursor-pointer" htmlFor="hasReservation">
                                    Tambahkan Reservasi Sekarang
                                </label>
                            </div>


                            {hasReservation && (
                                <>
                                    <div>
                                        <label className="form-label">Nomor Kamar</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="roomNumber"
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan nomor kamar"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Tanggal Reservasi</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={reservationData.date}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Harga Reservasi</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={reservationData.price}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                            placeholder="Masukkan harga reservasi"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Biaya Makan</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="mealCost"
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan biaya makan"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Biaya Laundry</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="laundryCost"
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan biaya laundry"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Biaya Lainnya</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="othersCost"
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan biaya lainnya"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="btn btn-success mt-3"
                                disabled={isLoading}
                            >
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
