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
    supplier_id: string;
    name: string;
    sku: string;
    category_id: string;
    cost_price: string;
    unit_price: string;
    reorder_level: string;
    description: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

const emptyForm = {
    supplier_id: '',
    name: '',
    sku: '',
    category_id: '',
    cost_price: '',
    unit_price: '',
    reorder_level: '',
    description: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function ProductIndex() {
    const { auth, products, categories, suppliers } = usePage<{
        auth: {
            user: {
                role: {
                    role_name: string;
                };
            };
        };
        products: any[];
        categories: any[];
        suppliers: any[];
    }>().props;
    const productList = products ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (p: Product) => {
        setForm({
            id: p.id,
            supplier_id: p.supplier_id,
            name: p.name,
            sku: p.sku,
            category_id: p.category_id,
            cost_price: p.cost_price,
            unit_price: p.unit_price,
            reorder_level: p.reorder_level,
            description: p.description,
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && form.id) {
            router.put(`/products/${form.id}`, form, {
                onSuccess: handleClose,
            });
        } else {
            router.post(`/products`, form, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this product?')) {
            router.delete(`/products/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>

                    {auth.user.role.role_name !== 'staff' && (
                        <Button onClick={handleOpenAdd}>Add Product</Button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Supplier
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    SKU
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Purchase Price
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Selling Price
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Reorder Rate
                                </th>
                                {auth.user.role.role_name !== 'staff' && (
                                    <>
                                        <th className="px-4 py-2 text-left font-semibold">
                                            Description
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold">
                                            Action
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {productList.map((p: any) => (
                                <tr
                                    key={p.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">
                                        {p.supplier?.name}
                                    </td>
                                    <td className="px-4 py-2">{p.sku}</td>
                                    <td className="px-4 py-2">
                                        {p.category?.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {p.cost_price}
                                    </td>
                                    <td className="px-4 py-2">
                                        {p.unit_price}
                                    </td>
                                    <td className="px-4 py-2">
                                        {p.reorder_level}
                                    </td>
                                    {auth.user.role.role_name !== 'staff' && (
                                        <>
                                            <td className="px-4 py-2">
                                                {p.description}
                                            </td>

                                            <td className="gap-2 px-4 py-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenEdit(p)
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(p.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* POPUP FORM */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Product' : 'Add Product'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>
                                Supplier<span className="text-red-500">*</span>
                            </Label>
                            <select
                                name="supplier_id"
                                value={form.supplier_id}
                                onChange={handleChange}
                                className="w-full border p-2"
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>
                                Name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                SKU<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                Category<span className="text-red-500">*</span>
                            </Label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full border p-2"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label>
                                Cost Price
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="cost_price"
                                value={form.cost_price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                Unit Price
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="unit_price"
                                value={form.unit_price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>
                                Reorder Level
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                name="reorder_level"
                                value={form.reorder_level}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
