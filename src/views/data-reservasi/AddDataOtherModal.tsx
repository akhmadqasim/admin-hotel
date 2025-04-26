import {useState} from "react";

const AddDataOtherModal = ({ isOpen, onClose, onSubmit, mealData }) => {
    const [form, setForm] = useState({
        costName: "",
        costAmount: "",
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
                        <h5 className="modal-title">Tambah Data Makan</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="costName" className="form-label">Tipe Lainnya</label>
                                <input
                                    type="text"
                                    id="costName"
                                    className="form-control"
                                    value={form.costName}
                                    disabled={isLoading}
                                    onChange={(e) => setForm({...form, mealType: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="costAmount" className="form-label">Harga</label>
                                <input
                                    type="number"
                                    id="costAmount"
                                    className="form-control"
                                    value={form.costAmount}
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

export default AddDataOtherModal;