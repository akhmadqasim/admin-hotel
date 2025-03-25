import Link from "next/link";

const ErrorLayer = () => {
    return (
        <div className='card basic-data-table'>
            <div className='card-body py-80 px-32 text-center'>
                <img src='assets/images/error-img.png' alt='' className='mb-24' />
                <h6 className='mb-16'>Halaman Tidak Ada</h6>
                <p className='text-secondary-light'>
                    Maaf halaman yang anda cari tidak ditemukan {" "}
                </p>
                <Link href='/' className='btn btn-primary-600 radius-8 px-20 py-11'>
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
};

export default ErrorLayer;
