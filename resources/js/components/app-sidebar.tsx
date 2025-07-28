import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Clock1, Clock10, File, FileClock, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';



//admin nav items
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/dashboard/user/manage',
        icon: BookOpen,
    },
    {
        title: 'Practitioner Management',
        href: '/dashboard/practitioner/manage',
        icon: FileClock,
    },
    {
        title: 'Schedule Management',
        href: '/admin/schedule/manage',
        icon: FileClock,
    },
    {
        title: 'Appointment Management',
        href: '/admin/appointment/manage',
        icon: FileClock,
    },
    {
        title: 'Patient Management',
        href: '/dashboard/patient/manage',
        icon: FileClock,
    }
];

//practitioner nav items
const practitionerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Schedule',
        href: '/practitioner/schedule',
        icon: Clock1,
    },
    {
        title: 'My appointments',
        href: '/practitioner/appointment',
        icon: FileClock,
    },
];
const patientNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Appointments',
        href: '#',
        icon: FileClock,
    },
    {
        title: 'My Reports',
        href: '#',
        icon: Folder,
    },
];

//frontdesk nav items
const frontDeskNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointments',
        href: '/admin/appointments',
        icon: FileClock,
    },
     {
         title: 'Book Appointment',
         href: '/appointment/select-schedule',
         icon: Clock1,
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: Folder,
    },
    {
        title: 'Practitioners',
        href: 'admin/practitioners',
        icon: Folder,
    },
];


//guest nav items
const guestNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

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
                        (auth.user.role === 'patient') ?
                            patientNavItems :
                            (auth.user.role === 'doctor') ?
                                practitionerNavItems :
                                (auth.user.role === 'frontdesk') ?
                                    frontDeskNavItems :
                                    guestNavItems
                } />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
