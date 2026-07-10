import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales Invoice',
        href: '/sales',
    },
];

export default function Invoice() {
    const { sale } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoice" />

            <Card className="mx-auto mt-6 max-w-4xl p-6">
                {/* HEADER WITH LOGO */}
                <div className="mb-6 flex items-center justify-between">
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/BookShop-Logo.png"
                            alt="logo"
                            className="h-20 w-20 object-contain"
                        />

                        <div>
                            <h2 className="text-xl font-bold text-gray-500">
                                Sachintha Book Shop
                            </h2>
                            <p className="text-sm text-gray-500">
                                Angoda, Mulleriyawa New Town.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-500">
                            Invoice #{sale.id}
                        </h1>
                        <p className="text-sm">
                            {new Date(sale.sale_date).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* PRINT BUTTON */}
                <div className="mb-4 flex justify-end">
                    <Button
                        onClick={() =>
                            window.open(
                                `/sales/${sale.id}/invoice-pdf`,
                                '_blank',
                            )
                        }
                    >
                        Print / Open PDF
                    </Button>
                </div>

                {/* STAFF INFO */}
                <div className="mb-4 text-gray-500">
                    <p>
                        <strong>Staff:</strong> {sale.user?.name}
                    </p>
                </div>

                {/* ITEMS TABLE */}
                <div className="overflow-x-auto text-gray-500">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Product
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Quantity
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Unit Price
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sale.items.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">
                                        {item.product?.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-2">
                                        Rs. {item.unit_price}
                                    </td>
                                    <td className="px-4 py-2 font-semibold">
                                        Rs. {item.total_price}
                                    </td>
                                </tr>
                            ))}

                            {sale.items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-4 text-center text-gray-500"
                                    >
                                        No items available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TOTAL */}
                <div className="mt-6 text-right text-xl font-bold text-gray-500">
                    Total Amount: Rs. {sale.total_amount}
                </div>

                {/* FOOTER */}
                <div className="mt-10 text-center text-sm text-gray-500">
                    Thank you for your purchase!
                </div>
            </Card>
        </AppLayout>
    );
}
