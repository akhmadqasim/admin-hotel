import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const UserList = () => {
    return (
        <div className='card h-100 p-0 radius-12'>
            <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
                <div className='d-flex align-items-center flex-wrap gap-3'>
                    <span className='text-md fw-medium text-secondary-light mb-0'>Show</span>
                    <select className='form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px' defaultValue='Select Number'>
                        <option value='Select Number' disabled>Select Number</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                    <form className='navbar-search'>
                        <input type='text' className='bg-base h-40-px w-auto' name='search' placeholder='Search' />
                        <Icon icon='ion:search-outline' className='icon' />
                    </form>
                </div>
                <Link
                    href='/add-user'
                    className='btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2'
                >
                    <Icon icon='ic:baseline-plus' className='icon text-xl line-height-1' />
                    Tambah Member
                </Link>
            </div>
            <div className='card-body p-24'>
                <div className='table-responsive scroll-sm'>
                    <table className='table bordered-table sm-table mb-0'>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>NIK</th>
                            <th>Nama</th>
                            <th>Birth Date</th>
                            <th>Birth Place</th>
                            <th>Reservations</th>
                            <th className='text-center'>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Dummy Data */}
                        <tr>
                            <td>1</td>
                            <td>1234567890123456</td>
                            <td>Kathryn Murphy</td>
                            <td>1995-05-15</td>
                            <td>Jakarta</td>
                            <td>3</td>
                            <td className='text-center'>
                                <div className='d-flex align-items-center gap-10 justify-content-center'>
                                    <button type='button' className='bg-info-focus text-info-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='majesticons:eye-line' className='icon text-xl' />
                                    </button>
                                    <button type='button' className='bg-success-focus text-success-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='lucide:edit' className='menu-icon' />
                                    </button>
                                    <button type='button' className='bg-danger-focus text-danger-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='fluent:delete-24-regular' className='menu-icon' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>9876543210987654</td>
                            <td>Annette Black</td>
                            <td>2000-01-20</td>
                            <td>Bandung</td>
                            <td>1</td>
                            <td className='text-center'>
                                <div className='d-flex align-items-center gap-10 justify-content-center'>
                                    <button type='button' className='bg-info-focus text-info-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='majesticons:eye-line' className='icon text-xl' />
                                    </button>
                                    <button type='button' className='bg-success-focus text-success-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='lucide:edit' className='menu-icon' />
                                    </button>
                                    <button type='button' className='bg-danger-focus text-danger-600 w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle'>
                                        <Icon icon='fluent:delete-24-regular' className='menu-icon' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24'>
                    <span>Showing 1 to 2 of 2 entries</span>
                    <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
                        <li className='page-item'>
                            <Link className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px' href='#'>
                                <Icon icon='ep:d-arrow-left' />
                            </Link>
                        </li>
                        <li className='page-item'>
                            <Link className='page-link bg-primary-600 text-white fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px' href='#'>1</Link>
                        </li>
                        <li className='page-item'>
                            <Link className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px' href='#'>2</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserList;
