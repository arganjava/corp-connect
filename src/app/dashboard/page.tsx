'use client';

import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, PlusCircle, ListOrdered, CreditCard, ArrowDownToLine } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your corporate account activity.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-5 w-5 text-muted-foreground"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,234,567.89</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <ListOrdered className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,502</div>
              <p className="text-xs text-muted-foreground">+120 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Virtual Accounts</CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <Link href="/transfers" passHref>
              <Button variant="outline" className="w-full justify-start h-20 p-4 text-left shadow hover:shadow-md transition-shadow">
                <ArrowRightLeft className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Make a Transfer</p>
                  <p className="text-sm text-muted-foreground">Single or bulk fund transfers.</p>
                </div>
              </Button>
            </Link>
            <Link href="/virtual-accounts" passHref>
              <Button variant="outline" className="w-full justify-start h-20 p-4 text-left shadow hover:shadow-md transition-shadow">
                <PlusCircle className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">Create Virtual Account</p>
                  <p className="text-sm text-muted-foreground">Generate custom virtual accounts.</p>
                </div>
              </Button>
            </Link>
             <Link href="/transactions" passHref>
              <Button variant="outline" className="w-full justify-start h-20 p-4 text-left shadow hover:shadow-md transition-shadow">
                <ListOrdered className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">View Transactions</p>
                  <p className="text-sm text-muted-foreground">Check your transaction history.</p>
                </div>
              </Button>
            </Link>
            <Link href="/withdraw" passHref>
              <Button variant="outline" className="w-full justify-start h-20 p-4 text-left shadow hover:shadow-md transition-shadow">
                <ArrowDownToLine className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Withdraw Funds</p>
                  <p className="text-sm text-muted-foreground">Transfer funds to your bank.</p>
                </div>
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A quick look at your latest transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for recent activity table or list */}
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 rounded-md hover:bg-secondary">
                  <div>
                    <p className="font-medium">Transfer to Supplier X</p>
                    <p className="text-sm text-muted-foreground">Completed - 2 hours ago</p>
                  </div>
                  <p className="font-medium text-destructive">-$5,000.00</p>
                </li>
                <li className="flex justify-between items-center p-3 rounded-md hover:bg-secondary">
                  <div>
                    <p className="font-medium">Payment from Client Y (VA)</p>
                    <p className="text-sm text-muted-foreground">Received - 5 hours ago</p>
                  </div>
                  <p className="font-medium text-green-600">+$10,200.00</p>
                </li>
                <li className="flex justify-between items-center p-3 rounded-md hover:bg-secondary">
                  <div>
                    <p className="font-medium">Salary Payments (Bulk)</p>
                    <p className="text-sm text-muted-foreground">Processed - Yesterday</p>
                  </div>
                  <p className="font-medium text-destructive">-$55,750.00</p>
                </li>
              </ul>
               <div className="mt-4 text-center">
                <Link href="/transactions" passHref>
                  <Button variant="link">View All Transactions</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
