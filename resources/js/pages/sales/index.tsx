import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    unit_price: number;
    stock?: {
        quantity: number;
    };
}

interface Sale {
    id: number;
    total_amount: number;
    sale_date: string;
    user?: {
        name: string;
    };
}

interface SaleItemForm {
    [key: string]: string;
    product_id: string;
    quantity: string;
}

interface Flash {
    success?: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '/sales',
    },
];

const emptyItem: SaleItemForm = {
    product_id: '',
    quantity: '',
};

export default function SalesIndex() {
    const { sales, products, flash } = usePage<{
        sales: Sale[];
        products: Product[];
        flash?: Flash;
    }>().props;

    const saleList = sales ?? [];
    const productList = products ?? [];

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<SaleItemForm[]>([{ ...emptyItem }]);

    const handleOpenAdd = () => {
        setItems([{ ...emptyItem }]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setItems([{ ...emptyItem }]);
    };

    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const updatedItems = [...items];

        updatedItems[index] = {
            ...updatedItems[index],
            [e.target.name]: e.target.value,
        };

        setItems(updatedItems);
    };

    const handleAddMore = () => {
        setItems([...items, { ...emptyItem }]);
    };

    const handleRemove = (index: number) => {
        if (items.length === 1) return;

        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        for (const item of items) {
            const selectedProduct = productList.find(
                (product) => product.id === Number(item.product_id),
            );

            if (!selectedProduct) {
                window.alert('Please select a product.');
                return;
            }

            const availableStock = selectedProduct.stock?.quantity ?? 0;

            if (availableStock <= 0) {
                window.alert(
                    `Cannot do sale. Stock is zero for product: ${selectedProduct.name}`,
                );
                return;
            }

            if (Number(item.quantity) > availableStock) {
                window.alert(
                    `Not enough stock for product: ${selectedProduct.name}. Available stock: ${availableStock}`,
                );
                return;
            }
        }

        router.post(
            '/sales',
            {items: items,},{onSuccess: () => {handleClose();},},
        );
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            router.delete(`/sales/${id}`);
        }
    };

    const handleInvoice = (id: number) => {
        router.get(`/sales/${id}/invoice`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />

            {flash?.success && (
                <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-700">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">
                    {flash.error}
                </div>
            )}

            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales</h1>
                    <Button onClick={handleOpenAdd}>Add Sale</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Staff
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Total Amount
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Sale Date
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {saleList.map((sale) => (
                                <tr
                                    key={sale.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">{sale.id}</td>
                                    <td className="px-4 py-2">
                                        {sale.user?.name ?? '-'}
                                    </td>
                                    <td className="px-4 py-2 font-semibold">
                                        Rs. {sale.total_amount}
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Date(
                                            sale.sale_date,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleInvoice(sale.id)
                                            }
                                        >
                                            Invoice
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(sale.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {saleList.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-4 text-center text-gray-500"
                                    >
                                        No sales available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Sale</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="space-y-4 rounded-lg border p-4"
                            >
                                <div>
                                    <Label htmlFor={`product_id_${index}`}>
                                        Product
                                    </Label>
                                    <select
                                        id={`product_id_${index}`}
                                        name="product_id"
                                        value={item.product_id}
                                        onChange={(e) => handleChange(index, e)}
                                        className="hover:bg-grey-50 w-full border p-2 dark:hover:bg-neutral-700"
                                        required
                                    >
                                        <option value="">Select Product</option>

                                        {productList.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor={`quantity_${index}`}>
                                        Quantity
                                    </Label>
                                    <Input
                                        id={`quantity_${index}`}
                                        name="quantity"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => handleRemove(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddMore}
                            >
                                Add More Product
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={handleClose}>
                                Cancel
                            </Button>

                            <Button type="submit" variant="outline">
                                Complete Sale
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
