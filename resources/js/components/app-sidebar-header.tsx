import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#e2e8f0]/50 bg-white/90 backdrop-blur-sm px-6 shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 dark:border-[#475569]/50 dark:bg-[#1e293b]/90 md:px-4 ">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-[#1e293b] hover:bg-[#f8fafc] dark:text-[#f1f5f9] dark:hover:bg-[#334155]" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
