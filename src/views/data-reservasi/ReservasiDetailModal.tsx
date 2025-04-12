import React, { useState, useMemo } from "react";

const ReservasiDetailModal = ({ member, onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    if (!member) return null;

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return member.reservations?.filter((res) => {
            const formattedDate = new Date(res.beginDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
            return (
                formattedDate.toLowerCase().includes(q) ||
                res.price.toString().includes(q) ||
                res.roomNumber.toLowerCase().includes(q)
            );
        }) || [];
    }, [member.reservations, searchQuery]);

    const totalHarga = filtered.reduce((acc, curr) => acc + (curr.price || 0), 0);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow-lg rounded-3 overflow-hidden">
                    <div className="modal-header text-white">
                        <h6 className="modal-title">Histori Reservasi: {member.name}</h6>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari tanggal atau harga"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // reset ke page 1 saat search
                                }}
                            />
                        </div>

                        {paginated.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: "400px" }}>
                                <table className="table table-bordered table-striped align-middle">
                                    <thead className="table-light sticky-top">
                                    <tr>
                                        <th className="text-center" style={{ width: "60px" }}>No</th>
                                        <th style={{ width: "150px" }}>Nomor Kamar</th>
                                        <th style={{ width: "200px" }}>Tanggal</th>
                                        <th style={{ width: "180px" }}>Biaya Reservasi</th>
                                        <th style={{ width: "180px" }}>Biaya Makan</th>
                                        <th style={{ width: "180px" }}>Biaya Laundry</th>
                                        <th style={{ width: "180px" }}>Biaya Lainnya</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginated.map((res, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                            <td>{res.roomNumber}</td>
                                            <td>{new Date(res.beginDate).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}</td>
                                            <td>Rp {(res.price || 0).toLocaleString("id-ID")}</td>
                                            <td>Rp {(res.mealCost || 0).toLocaleString("id-ID")}</td>
                                            <td>Rp {(res.laundryCost || 0).toLocaleString("id-ID")}</td>
                                            <td>Rp {(res.otherCost || 0).toLocaleString("id-ID")}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <th colSpan="6" className="text-end">Total</th>
                                        <th className="text-start">Rp {totalHarga.toLocaleString("id-ID")}</th>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-warning mb-0">
                                Tidak ada hasil yang cocok.
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span>Halaman {currentPage} dari {totalPages}</span>
                                <div className="btn-group">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                        &lt; Prev
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservasiDetailModal;
