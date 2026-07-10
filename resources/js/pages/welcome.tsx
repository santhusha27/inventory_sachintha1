import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Sachintha Book Shop" />

            <div
                className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 py-10"
                style={{
                    backgroundImage: "url('/images/book.png')",
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/55"></div>

                {/* Card */}
                <div className="relative z-10 w-full max-w-7xl overflow-hidden rounded-3xl border border-orange-500/30 bg-[#111111]/95 shadow-[0_0_60px_rgba(249,115,22,0.25)] backdrop-blur-md">

                    {/* Glow */}
                    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>
                    <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800 px-10 py-6">

                        <div className="flex items-center gap-4">

                            <img
                                src="/images/BookShop-Logo.png"
                                alt="Logo"
                                className="h-14 w-14 rounded-full border border-orange-500 bg-white p-1"
                            />

                            <div>
                                <h1 className="text-2xl font-bold text-orange-500">
                                    Sachintha Book Shop
                                </h1>

                                <p className="text-sm text-gray-400">
                                    Inventory & Sales Management System
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="rounded-full border border-orange-500 px-7 py-2 font-semibold text-orange-500 transition duration-300 hover:bg-orange-500 hover:text-black"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Hero */}
                    <div className="grid items-center gap-12 px-10 py-20 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <p className="mb-4 inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1 text-sm font-medium text-orange-400">
                                Welcome to Sachintha Book Shop
                            </p>

                            <h2 className="text-5xl font-extrabold leading-tight text-white lg:text-6xl">
                                Smart
                                <span className="text-orange-500">
                                    {" "}Inventory
                                </span>
                                <br />
                                Management System
                            </h2>

                            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
                                Efficiently manage products, suppliers,
                                inventory, purchases, sales, invoices and
                                reports through one modern web application
                                developed using Laravel, React and Inertia.js.
                            </p>

                            <div className="mt-12 flex flex-wrap gap-5">

                                <Link
                                    href="/login"
                                    className="rounded-full bg-orange-500 px-8 py-4 text-lg font-bold text-black transition hover:scale-105 hover:bg-orange-400"
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

                        {/* Right */}
                        <div className="flex justify-center">

                            <div className="relative">

                                <div className="absolute inset-0 rounded-3xl bg-orange-500/20 blur-3xl"></div>

                                <img
                                    src="/images/BookShop-Logo.png"
                                    alt="Book Shop"
                                    className="relative w-full max-w-lg rounded-3xl border-4 border-orange-500 shadow-2xl"
                                />

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}