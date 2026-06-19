import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase GRN',
        href: '/purchases',
    },
];

export default function PurchaseGrn() {
    const { purchase } = usePage<any>().props;

    const handleEmailGrn = () => {
        if (window.confirm('Email GRN to supplier?')) {
            router.post(`/purchases/${purchase.id}/email-grn`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase GRN" />

            <Card className="mx-auto mt-6 max-w-4xl p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        GRN #{purchase.grn_number}
                    </h1>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEmailGrn}>
                            Email GRN
                        </Button>

                        <Button onClick={() => window.print()}>Print</Button>
                    </div>
                </div>

                <div className="mb-4 space-y-1">
                    <p>
                        <strong>Supplier:</strong> {purchase.supplier?.name}
                    </p>
                    <p>
                        <strong>Supplier Email:</strong>{' '}
                        {purchase.supplier?.email ?? '-'}
                    </p>
                    <p>
                        <strong>Staff:</strong> {purchase.user?.name}
                    </p>
                    <p>
                        <strong>Date:</strong>{' '}
                        {new Date(purchase.purchase_date).toLocaleString()}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
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
                            {purchase.items.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-0"
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
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 text-right text-xl font-bold">
                    Total Amount: Rs. {purchase.total_amount}
                </div>
            </Card>
        </AppLayout>
    );
}
