import {useState} from "react";

const AddDataLaundryModal = ({ isOpen, onClose, onSubmit, mealData }) => {
    const [form, setForm] = useState({
        laundryType: "",
        laundryCost: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    return(
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)"}}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tambah Data Laundry</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="laundryType" className="form-label">Tipe Laundry</label>
                                <input
                                    type="text"
                                    id="laundryType"
                                    className="form-control"
                                    value={form.laundryType}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({...form, mealType: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="laundryCost" className="form-label">Harga Laundry</label>
                                <input
                                    type="number"
                                    id="laundryCost"
                                    className="form-control"
                                    value={form.laundryCost}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({...form, mealCost: e.target.value})}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Tutup</button>
                        <button type="button" className={`btn btn-primary ${isLoading ? "disabled" : ""}`} onClick={() => {
                            setIsLoading(true);
                            onSubmit(form);
                            setIsLoading(false);
                        }}>
                            {isLoading ? "Loading..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDataLaundryModal;