import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

interface Role {
    id: number;
    role_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function RoleIndex() {
    const { roles } = usePage<{ roles: Role[] }>().props;
    const roleList = roles ?? [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles</h1>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Role Name
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {roleList.length > 0 ? (
                                roleList.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-b last:border-0 dark:hover:bg-neutral-800"
                                    >
                                        <td className="px-4 py-2">{role.id}</td>
                                        <td className="px-4 py-2">
                                            {role.role_name}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="py-4 text-center"
                                    >
                                        No roles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AppLayout>
    );
}
