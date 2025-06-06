
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons/Logo';
import {
  LayoutDashboard,
  Settings,
  ArrowRightLeft,
  WalletCards,
  History,
  LogOut,
  UserCircle,
  ChevronDown,
  ArrowDownToLine,
  UserCog,
  Activity,
  PlugZap, // Added PlugZap icon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchStartsWith?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account-setup', label: 'Account Setup', icon: Settings },
  { href: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
  { href: '/withdraw', label: 'Withdrawals', icon: ArrowDownToLine },
  { href: '/virtual-accounts', label: 'Virtual Accounts', icon: WalletCards, matchStartsWith: true },
  { href: '/transactions', label: 'Transaction History', icon: History },
  { href: '/user-management', label: 'User Management', icon: UserCog, matchStartsWith: true },
  { href: '/user-activity', label: 'User Activity', icon: Activity, matchStartsWith: true },
  { href: '/integration', label: 'Integration', icon: PlugZap, matchStartsWith: true }, // New Nav Item
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  return (
    <SidebarProvider defaultOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
           <Link href="/dashboard" className={cn("transition-opacity duration-300", isSidebarOpen ? "opacity-100" : "opacity-0 w-0")}>
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={item.matchStartsWith ? pathname.startsWith(item.href) : pathname === item.href}
                    tooltip={{ children: item.label, className: "ml-2" }}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !isSidebarOpen && "justify-center")}>
                <UserCircle className="h-6 w-6" />
                {isSidebarOpen && <span className="ml-2 font-medium">User Name</span>}
                {isSidebarOpen && <ChevronDown className="ml-auto h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align={isSidebarOpen ? "start" : "center"} className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/account-setup')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md md:justify-end">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">Welcome, Bank User!</span>
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>BU</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
