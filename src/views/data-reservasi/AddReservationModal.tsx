import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReservationModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [form, setForm] = useState({
        roomNumber: "",
        price: "",
        checkIn: "",
        checkOut: "",
        mealCost: "",
        mealType: "",
        laundryCost: "",
        laundryType: "",
        otherCost: "",
        otherType: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showMeal, setShowMeal] = useState(false);
    const [showLaundry, setShowLaundry] = useState(false);
    const [showOther, setShowOther] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const convertToISOFormat = (date) => {
        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.roomNumber || !form.checkIn || !form.checkOut) {
            toast.error("Nomor kamar, check-in, dan check-out harus diisi");
            return;
        }

        const start = new Date(convertToISOFormat(form.checkIn) + "T00:00:00");
        const end = new Date(convertToISOFormat(form.checkOut) + "T00:00:00");
        if (start > end) {
            toast.error("Check-out tidak boleh lebih awal dari check-in");
            return;
        }

        if (isNaN(parseInt(form.price)) || parseInt(form.price) < 0) {
            toast.error("Harga reservasi tidak valid");
            return;
        }

        if (showMeal && (!form.mealCost || !form.mealType)) {
            toast.error("Biaya makan dan jenis makanan harus diisi");
            return;
        }

        if (showLaundry && (!form.laundryCost || !form.laundryType)) {
            toast.error("Biaya laundry dan jenis laundry harus diisi");
            return;
        }

        if (showOther && (!form.otherCost || !form.otherType)) {
            toast.error("Biaya lainnya dan jenis biaya harus diisi");
            return;
        }

        const payload = {
            memberId: member.id,
            roomNumber: form.roomNumber,
            checkIn: convertToISOFormat(form.checkIn),
            checkOut: convertToISOFormat(form.checkOut),
            price: parseInt(form.price || "0"),
            ...(showMeal && {
                mealCost: parseInt(form.mealCost || "0"),
                mealType: form.mealType,
            }),
            ...(showLaundry && {
                laundryCost: parseInt(form.laundryCost || "0"),
                laundryType: form.laundryType,
            }),
            ...(showOther && {
                otherCost: parseInt(form.otherCost || "0"),
                otherType: form.otherType,
            }),
        };


        setIsLoading(true);

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error("Gagal menambahkan reservasi");
            } else {
                const newReservation = await res.json();
                toast.success("Reservasi berhasil ditambahkan!");
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                onSubmit(newReservation);
                setForm({
                    roomNumber: "",
                    roomType: "",
                    price: "",
                    checkIn: "",
                    checkOut: "",
                    mealCost: "",
                    mealType: "",
                    laundryCost: "",
                    laundryType: "",
                    otherCost: "",
                    otherType: "",
                });
                setShowMeal(false);
                setShowLaundry(false);
                setShowOther(false);
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menyimpan reservasi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !member) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header text-white">
                        <h6 className="modal-title">Tambah Reservasi untuk {member.name}</h6>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={isLoading}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">Nomor Kamar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="roomNumber"
                                    value={form.roomNumber}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Contoh: 101"
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                    autoFocus
                                />
                            </div>

                            {/* Harga Reservasi */}
                            <div>
                                <label className="form-label">Harga Reservasi (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Contoh: 150000"
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                />
                            </div>

                            {/* Check-In */}
                            <div>
                                <label className="form-label">Check-In</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="checkIn"
                                    placeholder="DD-MM-YYYY"
                                    value={form.checkIn}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                />
                            </div>

                            {/* Check-Out */}
                            <div>
                                <label className="form-label">Check-Out</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="checkOut"
                                    placeholder="DD-MM-YYYY"
                                    value={form.checkOut}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                />
                            </div>

                            <hr />

                            {/* Toggle Biaya Makan */}
                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="toggleMeal"
                                    checked={showMeal}
                                    onChange={() => setShowMeal(!showMeal)}
                                    disabled={isLoading}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggleMeal"
                                    style={{ fontSize: "16px" }}
                                >
                                    Tambah Biaya Makan
                                </label>
                            </div>
                            {showMeal && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">Biaya Makan (Rp)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            name="mealCost"
                                            value={form.mealCost}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                            placeholder="Contoh: 20000"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label mt-1">Nama Makanan</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="mealType"
                                            value={form.mealType}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            placeholder="Misal: Sarapan"
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Toggle Biaya Laundry */}
                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="toggleLaundry"
                                    checked={showLaundry}
                                    onChange={() => setShowLaundry(!showLaundry)}
                                    disabled={isLoading}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggleLaundry"
                                    style={{ fontSize: "16px" }}
                                >
                                    Tambah Biaya Laundry
                                </label>
                            </div>
                            {showLaundry && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">Biaya Laundry (Rp)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            name="laundryCost"
                                            value={form.laundryCost}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            placeholder="Contoh: 10000"
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label mt-1">Jenis Laundry</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="laundryType"
                                            value={form.laundryType}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            placeholder="Misal: Reguler"
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Toggle Biaya Lainnya */}
                            <div className="form-check d-flex align-items-center gap-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="toggleOther"
                                    checked={showOther}
                                    onChange={() => setShowOther(!showOther)}
                                    disabled={isLoading}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="toggleOther"
                                    style={{ fontSize: "16px" }}
                                >
                                    Tambah Biaya Lainnya
                                </label>
                            </div>
                            {showOther && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">Biaya Tambahan (Rp)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            name="otherCost"
                                            value={form.otherCost}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            placeholder="Contoh: 5000"
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label mt-1">Tambahan</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="otherType"
                                            value={form.otherType}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            placeholder="Misal: Transport"
                                            style={{ fontSize: "16px", minHeight: "44px" }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-success mt-3"
                                disabled={isLoading}
                                style={{ fontSize: "16px", minHeight: "44px" }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Menambah...
                                    </>
                                ) : (
                                    'Tambah Data Reservasi'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReservationModal;
