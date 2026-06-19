import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Sachintha Book Shop" />

            <div className="flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
                <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-orange-500 bg-[#0d0d0d] shadow-2xl">
                    {/* GLOW EFFECTS */}

                    <div className="absolute top-[-100px] left-[-150px] h-96 w-96 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>

                    <div className="absolute right-[-120px] bottom-[-120px] h-96 w-96 rounded-full bg-orange-600 opacity-20 blur-3xl"></div>

                    {/* NAVBAR */}

                    <div className="relative z-10 flex items-center justify-between px-10 py-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/BookShop-Logo.png"
                                alt="Logo"
                                className="h-14 w-14"
                            />

                            <div>
                                <h1 className="text-2xl font-bold tracking-wide text-orange-500">
                                    Sachintha Book Shop
                                </h1>

                                <p className="text-sm text-gray-400">
                                    Inventory Management System
                                </p>
                            </div>
                        </div>

                        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex"></div>

                        <Link
                            href="/login"
                            className="rounded-full border border-orange-500 px-6 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-black"
                        >
                            LOGIN
                        </Link>
                    </div>

                    {/* HERO SECTION */}

                    <div className="relative z-10 grid grid-cols-1 items-center gap-10 px-10 py-20 lg:grid-cols-2">
                        {/* LEFT */}

                        <div>
                            <h2 className="text-6xl leading-tight font-extrabold text-white">
                                Smart
                                <span className="text-orange-500">
                                    {' '}
                                    Inventory
                                </span>
                                <br />
                                Management
                            </h2>

                            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
                                Easily manage products, stock, purchases,
                                suppliers, invoices, and sales with a powerful
                                modern inventory system for your bookshop.
                            </p>

                            <div className="mt-10 flex gap-5">
                                <Link
                                    href="/login"
                                    className="rounded-full bg-orange-500 px-8 py-4 text-lg font-bold text-black transition hover:bg-orange-400"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-full border border-orange-500 px-8 py-4 text-lg font-bold text-orange-500 transition hover:bg-orange-500 hover:text-black"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT */}

                        <div className="flex justify-center">
                            <img
                                src="/images/BookShop-Logo.png"
                                alt="Bookshop"
                                className="w-full max-w-md rounded-3xl border border-orange-500 shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
