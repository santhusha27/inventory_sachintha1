import InputError from '@/components/input-error';
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

interface User {
    id: number;
    role_id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: {
        role_name: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const emptyForm = { name: '', email: '', phone: '', password: '', role_id: '' };

type FormState = typeof emptyForm & { id?: number };

export default function UserIndex() {
    const {
        users,
        roles,
        errors = {},
    } = usePage<{
        users: any[];
        roles: any[];
        errors: Record<string, string>;
    }>().props;
    const userList = users ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setForm({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: '',
            role_id: user.role_id,
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
            router.put(`/users/${form.id}`, form, {
                onSuccess: handleClose,
            });
        } else {
            router.post(`/users`, form, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="font-blod text-2xl">Users</h1>
                    <Button onClick={handleOpenAdd}>Add User</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-orange-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Role
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Phone No
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-0 dark:hover:bg-neutral-800"
                                >
                                    <td className="px-4 py-2">{user.id}</td>
                                    <td className="px-4 py-2">
                                        {user.role?.role_name}
                                    </td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.phone}</td>
                                    <td className="gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEdit(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(user.id)
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
                            {isEdit ? 'Update User' : 'Add User'}
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
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
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
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone No</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            ></Input>
                            <InputError
                                message={errors.phone}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">
                                Password<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required={!isEdit}
                            ></Input>
                            <InputError
                                message={errors.password}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role_id">
                                Role<span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="role_id"
                                name="role_id"
                                value={form.role_id}
                                onChange={handleChange}
                                className="hover:bg-grey-50 w-full border p-2 dark:hover:bg-neutral-700"
                                required
                            >
                                <option value="">Select Role</option>
                                {roles.map((role: any) => (
                                    <option key={role.id} value={role.id}>
                                        {role.role_name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.role_id}
                                className="mt-1"
                            />
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
