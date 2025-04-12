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
        roomNumber: "",
        beginDate: "",
        endDate: "",
        price: "",
        mealCost: "",
        laundryCost: "",
        otherCost: "",
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
            roomNumber: "",
            beginDate: "",
            endDate: "",
            price: "",
            mealCost: "",
            laundryCost: "",
            otherCost: "",
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
            const { roomNumber, beginDate, endDate } = reservationData;
            if (!roomNumber ||!beginDate || !endDate ) {
                toast.error("Nomor kamar, tanggal masuk, dan tanggal keluar wajib diisi!");
                return false;
            }

            if (new Date(beginDate) > new Date(endDate)) {
                toast.error("Tanggal masuk tidak boleh setelah tanggal keluar.");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const {
            roomNumber,
            price,
            mealCost,
            laundryCost,
            otherCost,
            beginDate,
            endDate
        } = reservationData;

        const priceValue = parseInt(price || "0");
        const meal = parseInt(mealCost || "0");
        const laundry = parseInt(laundryCost || "0");
        const others = parseInt(otherCost || "0");

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
                const dates = getDatesInRange(beginDate, endDate);

                const reservationPayloads = dates.map((date) => ({
                    memberId: String(member.id),
                    beginDate: formatDateToISOOffset(date),
                    endDate: formatDateToISOOffset(date),
                    roomNumber: roomNumber || undefined,
                    price: priceValue,
                    mealCost: meal,
                    laundryCost: laundry,
                    otherCost: others,
                }));

                const reservationResponses = await Promise.all(
                    reservationPayloads.map((payload) =>
                        fetch("/api/reservations", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        }).then((res) => res.json())
                    )
                );

                member.reservations = reservationResponses.map((r) => r.reservation);
                member._count = {
                    reservations: member.reservations.length,
                };
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

    const formatDateToISOOffset = (date) => {
        const tzOffset = "+00:00";
        return date.toISOString().replace("Z", tzOffset);
    };

    const getDatesInRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dates = [];

        while (startDate <= endDate) {
            dates.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }

        return dates;
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
                            {[{ label: "NIK", name: "nik", placeholder: "Masukkan NIK" },
                                { label: "Nama", name: "name", placeholder: "Masukkan Nama" },
                                { label: "Tempat Lahir", name: "birthPlace", placeholder: "Masukkan Tempat Lahir" }]
                                .map((field) => (
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
                                            value={reservationData.roomNumber}
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan nomor kamar"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Tanggal Masuk</label>
                                        <input
                                            type="date"
                                            name="beginDate"
                                            value={reservationData.beginDate}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Tanggal Keluar</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={reservationData.endDate}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Harga Reservasi</label>
                                        <input
                                            type="number"
                                            min="0"
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
                                            min="0"
                                            className="form-control"
                                            name="mealCost"
                                            value={reservationData.mealCost}
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan biaya makan"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Biaya Laundry</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            name="laundryCost"
                                            value={reservationData.laundryCost}
                                            onChange={handleReservationChange}
                                            placeholder="Masukkan biaya laundry"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Biaya Lainnya</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            name="otherCost"
                                            value={reservationData.otherCost}
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
