'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const CardCount = () => {
    const [totalMember, setTotalMember] = useState(0);
    const [totalReservation, setTotalReservation] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [tanggal, setTanggal] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const memberRes = await fetch('/api/members');
                const memberData = await memberRes.json();
                if (memberRes.ok) {
                    setTotalMember(memberData.members.length);
                }

                const reservRes = await fetch('/api/reservations');
                const reservData = await reservRes.json();

                if (reservRes.ok) {
                    setTotalReservation(reservData.reservations.length);

                    const totalPrice = reservData.reservations.reduce((acc, reservation) => {
                        const price = reservation.price || 0;

                        const mealCosts = reservation.mealCost?.reduce((sum, meal) =>
                            sum + (meal.mealCost || 0), 0) || 0;

                        const laundryCosts = reservation.laundryCost?.reduce((sum, laundry) =>
                            sum + (laundry.laundryCost || 0), 0) || 0;

                        const otherCosts = reservation.otherCost?.reduce((sum, other) =>
                            sum + (other.costAmount || 0), 0) || 0;

                        return acc + price + mealCosts + laundryCosts + otherCosts;
                    }, 0);

                    setTotalRevenue(totalPrice);
                }

                const today = new Date();
                const formatted = today.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                setTanggal(formatted);

            } catch (error) {
                console.error('Gagal mengambil data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 gy-4">
            <Link href="/tamu">
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-1 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">Total Member Tamu</p>
                                    <h6 className="mb-0">{totalMember}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="gridicons:multiple-users"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <Link href="/reservasi">
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-2 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">
                                        Total Reservasi
                                    </p>
                                    <h6 className="mb-0">{totalReservation}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="fa-solid:award"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <Link href="/rekap-pemasukan">
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-4 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">Total Pemasukan</p>
                                    <h6 className="mb-0">Rp {totalRevenue.toLocaleString('id-ID')}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="solar:wallet-bold"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <Link href="#">
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-3 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">
                                        Tanggal Hari Ini
                                    </p>
                                    <h6 className="mb-0">{tanggal}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="fluent:people-20-filled"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CardCount;
