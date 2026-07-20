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

interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Supplier',
        href: '/suppliers',
    },
];

const emptyForm = { name: '', phone: '', email: '', address: '' };

type FormState = typeof emptyForm & { id?: number };

export default function SupplierIndex() {
    const { suppliers } = usePage<{ suppliers: any[] }>().props;
    const supplierList = suppliers ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (supplier: Supplier) => {
        setForm({
            id: supplier.id,
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/suppliers/${form.id}`, form, {
                onSuccess: handleClose,
            });
        } else {
            router.post(`/suppliers`, form, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            router.delete(`/suppliers/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="font-blod text-2xl">Suppliers</h1>
                    <Button onClick={handleOpenAdd}>Add Supplier</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Phone No
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Address
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplierList.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">{supplier.id}</td>
                                    <td className="px-4 py-2">
                                        {supplier.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {supplier.phone}
                                    </td>
                                    <td className="px-4 py-2">
                                        {supplier.email}
                                    </td>
                                    <td className="px-4 py-2">
                                        {supplier.address}
                                    </td>
                                    <td className="gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenEdit(supplier)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(supplier.id)
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
                        <DialogTitle>
                            {isEdit ? 'Update Supplier' : 'Add Supplier'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">
                                Name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            ></Input>
                        </div>
                        <div>
                            <Label htmlFor="phone">
                                Phone No<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            ></Input>
                        </div>
                        <div>
                            <Label htmlFor="email">
                                Email<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            ></Input>
                        </div>
                        <div>
                            <Label htmlFor="address">
                                Address<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="adress"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            ></Input>
                        </div>
                        <div className="justify-end-gap-2 flex">
                            <Button type="button" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="outline">
                                {' '}
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
