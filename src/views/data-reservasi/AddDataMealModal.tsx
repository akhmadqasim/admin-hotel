import {useState} from "react";
import {toast} from "react-toastify";

const AddDataMealModal = ({ isOpen, onClose, reservationId, onSuccess }) => {
    const [form, setForm] = useState({
        mealType: "",
        mealCost: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/reservations/${reservationId}/meal-cost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reservationId,
                    mealType: form.mealType,
                    mealCost: Number(form.mealCost),
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menambahkan data makan");
            }

            toast.success("Data makan berhasil ditambahkan!");

            if (onSuccess) {
                onSuccess({
                    mealType: form.mealType,
                    mealCost: Number(form.mealCost),
                });
            }

            onClose();
            setForm({ mealType: "", mealCost: "" });
        } catch (error) {
            toast.error("Gagal menambahkan data makan!");
        }
        setIsLoading(false);
    }

    if (!isOpen) return null;

    return(
        <div
            className="modal show d-block"
             tabIndex={-1}
             style={{ backgroundColor: "rgba(0,0,0,0.5)"}}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Data Makan</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="mealType" className="form-label">Tipe Makan</label>
                                <input
                                    type="text"
                                    id="mealType"
                                    className="form-control"
                                    value={form.mealType}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({...form, mealType: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="mealCost" className="form-label">Harga Makan</label>
                                <input
                                    type="number"
                                    id="mealCost"
                                    className="form-control"
                                    value={form.mealCost}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({...form, mealCost: e.target.value})}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Batal
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDataMealModal;