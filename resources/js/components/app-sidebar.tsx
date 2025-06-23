import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Clock1, Clock10, File, FileClock, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

//admin nav items
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/admin/user',
        icon: BookOpen,
    },
    {
        title: 'Appointment Management',
        href: '/admin/appointment',
        icon: FileClock,
    },
    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
        icon: FileClock,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: File,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Notifications',
        href: '/dashboard',
        icon: Bell,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={
                    (auth.user.role === 'admin') ?
                        adminNavItems :
                        (auth.user.role === 'practitioner') ?
                            mainNavItems :
                            (auth.user.role === 'frontdesk') ?
                                mainNavItems :
                                mainNavItems
                } />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
