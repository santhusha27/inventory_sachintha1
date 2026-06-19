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
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

const emptyForm = { name: '' };
type FormState = typeof emptyForm & { id?: number };

export default function CategoryIndex() {
    const { categories } = usePage<{ categories: any[] }>().props;
    const categoryList = categories ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (cat: Category) => {
        setForm({
            id: cat.id,
            name: cat.name,
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
            router.put(`/categories/${form.id}`, form, {
                onSuccess: handleClose,
            });
        } else {
            router.post(`/categories`, form, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this category?')) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={handleOpenAdd}>Add Category</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Category Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {categoryList.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-4 py-2">{cat.id}</td>
                                    <td className="px-4 py-2">{cat.name}</td>
                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEdit(cat)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(cat.id)}
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

            {/* Popup */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Category' : 'Add Category'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
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
