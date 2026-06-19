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
    supplier_id: number;
    name: string;
    cost_price: number;
}

interface Supplier {
    id: number;
    name: string;
}

interface PurchaseItemForm {
    [key: string]: string;

    product_id: string;
    quantity: string;
}

interface Purchase {
    id: number;
    grn_number: string;
    total_amount: number;
    purchase_date: string;

    supplier?: {
        name: string;
    };

    user?: {
        name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchases',
        href: '/purchases',
    },
];

const emptyItem: PurchaseItemForm = {
    product_id: '',
    quantity: '',
};

export default function PurchaseIndex() {
    const { purchases, suppliers, products } = usePage<{
        purchases: Purchase[];
        suppliers: Supplier[];
        products: Product[];
    }>().props;

    const purchaseList = purchases ?? [];
    const supplierList = suppliers ?? [];
    const productList = products ?? [];

    const [open, setOpen] = useState(false);

    const [supplierId, setSupplierId] = useState('');

    const [items, setItems] = useState<PurchaseItemForm[]>([{ ...emptyItem }]);

    // FILTER PRODUCTS
    const filteredProducts = productList.filter(
        (product) => Number(product.supplier_id) === Number(supplierId),
    );

    const handleOpenAdd = () => {
        setSupplierId('');

        setItems([{ ...emptyItem }]);

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        setSupplierId('');

        setItems([{ ...emptyItem }]);
    };

    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSupplierId(e.target.value);

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

        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!supplierId) {
            alert('Please select supplier.');

            return;
        }

        router.post(
            '/purchases',
            {
                supplier_id: supplierId,
                items: items,
            },
            {
                onSuccess: handleClose,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this purchase?')) {
            router.delete(`/purchases/${id}`);
        }
    };

    const handleViewGrn = (id: number) => {
        router.get(`/purchases/${id}/grn`);
    };

    const handleEmailGrn = (id: number) => {
        if (window.confirm('Email GRN to supplier?')) {
            router.post(`/purchases/${id}/email-grn`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchases" />

            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Purchases / GRN</h1>

                    <Button onClick={handleOpenAdd}>Add Purchase</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    GRN No
                                </th>

                                <th className="px-4 py-2 text-left font-semibold">
                                    Supplier
                                </th>

                                <th className="px-4 py-2 text-left font-semibold">
                                    Staff
                                </th>

                                <th className="px-4 py-2 text-left font-semibold">
                                    Total
                                </th>

                                <th className="px-4 py-2 text-left font-semibold">
                                    Date
                                </th>

                                <th className="px-4 py-2 text-left font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseList.map((purchase) => (
                                <tr
                                    key={purchase.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">
                                        {purchase.grn_number}
                                    </td>

                                    <td className="px-4 py-2">
                                        {purchase.supplier?.name ?? '-'}
                                    </td>

                                    <td className="px-4 py-2">
                                        {purchase.user?.name ?? '-'}
                                    </td>

                                    <td className="px-4 py-2">
                                        Rs. {purchase.total_amount}
                                    </td>

                                    <td className="px-4 py-2">
                                        {new Date(
                                            purchase.purchase_date,
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleViewGrn(purchase.id)
                                            }
                                        >
                                            View GRN
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleEmailGrn(purchase.id)
                                            }
                                        >
                                            Email GRN
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(purchase.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Purchase</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* SUPPLIER */}

                        <div>
                            <Label>Supplier</Label>

                            <select
                                value={supplierId}
                                onChange={handleSupplierChange}
                                className="w-full border p-2"
                                required
                            >
                                <option value="">Select Supplier</option>

                                {supplierList.map((supplier) => (
                                    <option
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PRODUCTS */}

                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="space-y-4 rounded-lg border p-4"
                            >
                                <div>
                                    <Label>Product</Label>

                                    <select
                                        name="product_id"
                                        value={item.product_id}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full border p-2"
                                        required
                                        disabled={!supplierId}
                                    >
                                        <option value="">
                                            {supplierId
                                                ? 'Select Product'
                                                : 'Select supplier first'}
                                        </option>

                                        {filteredProducts.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name}
                                                {' - '}
                                                Rs.
                                                {product.cost_price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label>Quantity</Label>

                                    <Input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemove(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddMore}
                        >
                            Add More Product
                        </Button>

                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={handleClose}>
                                Cancel
                            </Button>

                            <Button type="submit" variant="outline">
                                Save Purchase
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
