"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddMemberModal = ({ isOpen, onClose, onSubmit, members }) => {
    const [formData, setFormData] = useState({
        code: "",
        nik: "",
        name: "",
        address: "",
        birthDate: "",
        birthPlace: "",
    });

    const [showMeal, setShowMeal] = useState(false);
    const [showLaundry, setShowLaundry] = useState(false);
    const [showOther, setShowOther] = useState(false);
    const [hasReservation, setHasReservation] = useState(false);
    const [reservationData, setReservationData] = useState({
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

    const resetForm = () => {
        setFormData({
            code: "",
            nik: "",
            name: "",
            address: "",
            birthDate: "",
            birthPlace: "",
        });
        setHasReservation(false);
        setReservationData({
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
        setShowMeal(false);
        setShowLaundry(false);
        setShowOther(false);
    };

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
        } else if (name === "name" || name === "birthPlace" || name === "address") {
            formattedValue = value.toUpperCase();
        }

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
        // wajib isi: kode member & nama
        if (!formData.code.trim()) {
            toast.error("Kode Member wajib diisi.");
            return false;
        }

        if (!formData.name.trim()) {
            toast.error("Nama wajib diisi.");
            return false;
        }

        // validasi duplikasi
        if (members.some((m) => m.code === formData.code)) {
            toast.error("Kode Member sudah terdaftar.");
            return false;
        }

        if (formData.nik && members.some((m) => m.nik === formData.nik)) {
            toast.error("NIK sudah terdaftar.");
            return false;
        }

        // validasi format nik
        if (formData.nik && !/^\d+$/.test(formData.nik)) {
            toast.error("NIK hanya boleh berupa angka.");
            return false;
        }

        // validasi reservasi opsional
        if (reservationData.checkIn && reservationData.checkOut) {
            if (new Date(reservationData.checkIn) > new Date(reservationData.checkOut)) {
                toast.error("Tanggal check-in tidak boleh setelah check-out.");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            ...formData,
            nik: formData.nik?.trim() === "" ? null : formData.nik,
            address: formData.address?.trim() === "" ? null : formData.address,
            birthPlace: formData.birthPlace?.trim() === "" ? null : formData.birthPlace,
            birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        };

        console.log("📦 Payload dikirim ke API /members:", payload);

        setIsLoading(true);

        try {
            const memberRes = await fetch("/api/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!memberRes.ok) {
                toast.error("Gagal menambahkan member.");
                console.error("Failed to add member:", await memberRes.text());
                console.log("🚫 Response status:", memberRes.status);
                return;
            }

            const memberResult = await memberRes.json();
            const member = memberResult.member;

            if (hasReservation) {
                const reservationPayload = {
                    memberId: String(member.id),
                    roomNumber: reservationData.roomNumber || null,
                    price: reservationData.price ? Number(reservationData.price) : null,
                    checkIn: reservationData.checkIn || null,
                    checkOut: reservationData.checkOut || null,
                    ...(showMeal && {
                        mealCost: reservationData.mealCost ? Number(reservationData.mealCost) : null,
                        mealType: reservationData.mealType || null,
                    }),
                    ...(showLaundry && {
                        laundryCost: reservationData.laundryCost ? Number(reservationData.laundryCost) : null,
                        laundryType: reservationData.laundryType || null,
                    }),
                    ...(showOther && {
                        otherCost: reservationData.otherCost ? Number(reservationData.otherCost) : null,
                        otherType: reservationData.otherType || null,
                    }),
                };

                const reservationRes = await fetch("/api/reservations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(reservationPayload),
                });

                if (!reservationRes.ok) {
                    toast.error("Gagal menambahkan reservasi.");
                    return;
                }

                const reservationResult = await reservationRes.json();
                member.reservations = [reservationResult.reservation];
                member._count = { reservations: 1 };
            } else {
                member._count = { reservations: 0 };
            }

            onSubmit(member);
            toast.success("Member berhasil ditambahkan!");
            setTimeout(() => window.location.reload(), 500);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error:", error);
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

                            {[
                                { label: "Nama", name: "name", placeholder: "Masukkan Nama", required: true },
                                { label: "Kode Member", name: "code", placeholder: "Masukkan Kode Member", required: true },
                                { label: "NIK", name: "nik", placeholder: "Masukkan NIK", required: false },
                                { label: "Alamat", name: "address", placeholder: "Masukkan Alamat", required: false },
                                { label: "Tempat Lahir", name: "birthPlace", placeholder: "Masukkan Tempat Lahir", required: false }
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="form-label">{field.label}</label>
                                    <input
                                        name={field.name}
                                        value={formData[field.name]}
                                        type={field.name === "nik" ? "number" : "text"}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder={field.placeholder}
                                        required={field.required}
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

                            {/* switch reservasi */}
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

                            {/* bagian reservasi opsional */}
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
                                        <label className="form-label">Harga Reservasi</label>
                                        <input
                                            type="number"
                                            name="price"
                                            min="0"
                                            value={reservationData.price}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                            placeholder="Masukkan harga reservasi"
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Check-In</label>
                                        <input
                                            type="date"
                                            name="checkIn"
                                            value={reservationData.checkIn}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Check-Out</label>
                                        <input
                                            type="date"
                                            name="checkOut"
                                            value={reservationData.checkOut}
                                            onChange={handleReservationChange}
                                            className="form-control"
                                        />
                                    </div>

                                    {/* toggle biaya makan */}
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="toggleMeal"
                                            checked={showMeal}
                                            onChange={() => setShowMeal(!showMeal)}
                                        />
                                        <label className="form-check-label" htmlFor="toggleMeal">
                                            Tambah Biaya Makan
                                        </label>
                                    </div>
                                    {showMeal && (
                                        <div className="border rounded p-3">
                                            <div className="mt-2">
                                                <label className="form-label">Nama Makanan</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="mealType"
                                                    value={reservationData.mealType}
                                                    onChange={handleReservationChange}
                                                    placeholder="Masukkan jenis makanan"
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
                                        </div>
                                    )}

                                    {/* toggle biaya laundry */}
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="toggleLaundry"
                                            checked={showLaundry}
                                            onChange={() => setShowLaundry(!showLaundry)}
                                        />
                                        <label className="form-check-label" htmlFor="toggleLaundry">
                                            Tambah Biaya Laundry
                                        </label>
                                    </div>
                                    {showLaundry && (
                                        <div className="border rounded p-3">
                                            <div className="mt-2">
                                                <label className="form-label">Jenis Laundry</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="laundryType"
                                                    value={reservationData.laundryType}
                                                    onChange={handleReservationChange}
                                                    placeholder="Masukkan jenis laundry"
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
                                        </div>
                                    )}

                                    {/* toggle biaya lainnya */}
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="toggleOther"
                                            checked={showOther}
                                            onChange={() => setShowOther(!showOther)}
                                        />
                                        <label className="form-check-label" htmlFor="toggleOther">
                                            Tambah Biaya Lainnya
                                        </label>
                                    </div>
                                    {showOther && (
                                        <div className="border rounded p-3">
                                            <div className="mt-2">
                                                <label className="form-label">Tambahan</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="otherType"
                                                    value={reservationData.otherType}
                                                    onChange={handleReservationChange}
                                                    placeholder="Masukkan tambahan lainnya"
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Biaya Tambahan</label>
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
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => {
                                        resetForm();
                                        onClose();
                                    }}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Menambah...
                                        </>
                                    ) : (
                                        'Tambah Member'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AddMemberModal;
