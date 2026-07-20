import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BadgeDollarSign,
    BarChart3,
    LayoutGrid,
    NotepadText,
    PackageSearch,
    ShoppingBag,
    UserRoundCog,
    UserRoundMinus,
    UsersRound,
    Warehouse,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Products',
        href: '/products',
        icon: PackageSearch,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: NotepadText,
    },
    {
        title: 'Purchases',
        href: '/purchases',
        icon: ShoppingBag,
    },
    {
        title: 'Suppliers',
        href: '/suppliers',
        icon: UserRoundMinus,
    },
    {
        title: 'Stock',
        href: '/stocks',
        icon: Warehouse,
    },
    {
        title: 'Sales',
        href: '/sales',
        icon: BadgeDollarSign,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: UserRoundCog,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    // 🔹 Get logged user
    const { auth } = usePage().props as any;
    const roleId = auth.user?.role_id;

    // 🔹 Filter menu based on role
    const filteredNavItems = mainNavItems.filter((item) => {
        // Admin sees everything
        if (roleId === 1) return true;

        // Store Keeper permissions
        if (roleId === 2) {
            return [
                'Dashboard',
                'Products',
                'Categories',
                'Purchases',
                'Suppliers',
                'Stock',
            ].includes(item.title);
        }

        // Staff permissions
        if (roleId === 3) {
            return ['Dashboard', 'Stock', 'Sales', 'Products'].includes(
                item.title,
            );
        }

        return false;
    });

    return (
        <Sidebar collapsible="icon" variant="inset" className="">
            <SidebarHeader className="bg-[#EFB261]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#EFB261]">
                <NavMain items={filteredNavItems} />
            </SidebarContent>
            <SidebarFooter className="bg-[#EFB261]">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
