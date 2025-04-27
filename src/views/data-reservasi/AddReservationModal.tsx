import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReservationModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [form, setForm] = useState({
        roomNumber: "",
        checkIn: "",
        checkOut: "",
        price: "",
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

    const formatDateToISOOffset = (dateInput) => {
        // pastikan format `YYYY-MM-DDT00:00:00`
        return new Date(dateInput + "T00:00:00").toISOString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validasi wajib
        if (!form.roomNumber || !form.checkIn || !form.checkOut) {
            toast.error("Nomor kamar, check-in, dan check-out harus diisi");
            return;
        }

        const start = new Date(form.checkIn + "T00:00:00");
        const end = new Date(form.checkOut + "T00:00:00");
        if (start > end) {
            toast.error("Check-out tidak boleh lebih awal dari check-in");
            return;
        }

        // build payload untuk satu reservasi
        const payload = {
            memberId: member.id,
            roomNumber: form.roomNumber,
            checkIn: formatDateToISOOffset(form.checkIn),
            checkOut: formatDateToISOOffset(form.checkOut),
            price: parseInt(form.price || "0"),
        };
        if (showMeal) {
            payload.mealCost = parseInt(form.mealCost || "0");
            payload.mealType = form.mealType;
        }
        if (showLaundry) {
            payload.laundryCost = parseInt(form.laundryCost || "0");
            payload.laundryType = form.laundryType;
        }
        if (showOther) {
            payload.otherCost = parseInt(form.otherCost || "0");
            payload.otherType = form.otherType;
        }

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
                onSubmit(newReservation);
                // reset form
                setForm({
                    roomNumber: "",
                    checkIn: "",
                    checkOut: "",
                    price: "",
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
                                <label className="form-label">🛏️ Nomor Kamar</label>
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

                            {/* Check-In */}
                            <div>
                                <label className="form-label">📅 Check-In</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="checkIn"
                                    value={form.checkIn}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                />
                            </div>

                            {/* Check-Out */}
                            <div>
                                <label className="form-label">📅 Check-Out</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="checkOut"
                                    value={form.checkOut}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    style={{ fontSize: "16px", minHeight: "44px" }}
                                />
                            </div>

                            {/* Harga Reservasi */}
                            <div>
                                <label className="form-label">💰 Harga Reservasi (Rp)</label>
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
                                    🍽️ Tambah Biaya Makan
                                </label>
                            </div>
                            {showMeal && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">💰 Biaya Makan (Rp)</label>
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
                                        <label className="form-label mt-1">🍽️ Jenis Makanan</label>
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
                                    🧺 Tambah Biaya Laundry
                                </label>
                            </div>
                            {showLaundry && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">💰 Biaya Laundry (Rp)</label>
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
                                        <label className="form-label mt-1">🧺 Jenis Laundry</label>
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
                                    💼 Tambah Biaya Lainnya
                                </label>
                            </div>
                            {showOther && (
                                <div className="border rounded p-3 bg-light">
                                    <div>
                                        <label className="form-label">💰 Biaya Lainnya (Rp)</label>
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
                                        <label className="form-label mt-1">💼 Jenis Biaya</label>
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
                                {isLoading ? "Menambah..." : "Tambah Reservasi"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReservationModal;
