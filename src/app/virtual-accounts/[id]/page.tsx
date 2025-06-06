
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Copy, DollarSign, CalendarDays, Info, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// Re-using VirtualAccount type from the list page for consistency
interface VirtualAccount {
  id: string;
  customId: string;
  purpose: string;
  creationDate: string;
  status: 'Active' | 'Inactive';
  balance: number;
}

interface PaymentTransaction {
  id: string;
  date: string;
  type: 'Deposit' | 'Withdrawal';
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

// Sample data - in a real app, this would be fetched based on accountId
const allVirtualAccounts: VirtualAccount[] = [
  { id: 'VA001', customId: 'CLIENTCORP-A', purpose: 'Client A Payments', creationDate: '2023-05-10', status: 'Active', balance: 5500.00 },
  { id: 'VA002', customId: 'PROJECTX-FUNDS', purpose: 'Project X Funding', creationDate: '2023-06-15', status: 'Active', balance: 12030.50 },
  { id: 'VA003', customId: 'MARKETING-CAMP', purpose: 'Marketing Campaign Q3', creationDate: '2023-07-01', status: 'Inactive', balance: 0.00 },
];

const samplePaymentHistory: { [key: string]: PaymentTransaction[] } = {
  'VA001': [
    { id: 'PAY001', date: '2024-07-20', type: 'Deposit', description: 'Payment from Client A - INV1001', amount: 2000.00, status: 'Completed' },
    { id: 'PAY002', date: '2024-07-22', type: 'Deposit', description: 'Payment from Client A - INV1002', amount: 3500.00, status: 'Completed' },
    { id: 'PAY003', date: '2024-07-25', type: 'Withdrawal', description: 'Transfer to main account', amount: -1000.00, status: 'Completed' },
  ],
  'VA002': [
    { id: 'PAY004', date: '2024-07-18', type: 'Deposit', description: 'Initial Project X funding', amount: 10000.00, status: 'Completed' },
    { id: 'PAY005', date: '2024-07-21', type: 'Deposit', description: 'Additional funding round', amount: 5030.50, status: 'Completed' },
    { id: 'PAY006', date: '2024-07-23', type: 'Withdrawal', description: 'Vendor payment - Phase 1', amount: -2500.00, status: 'Pending' },
    { id: 'PAY007', date: '2024-07-24', type: 'Withdrawal', description: 'Operational cost', amount: -500.00, status: 'Completed' },
  ],
  'VA003': [], // No transactions for inactive account
};

export default function VirtualAccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const accountId = params.id as string;

  const [accountDetails, setAccountDetails] = useState<VirtualAccount | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    if (accountId) {
      // Simulate fetching data
      const foundAccount = allVirtualAccounts.find(acc => acc.id === accountId);
      setAccountDetails(foundAccount || null);
      setPaymentHistory(samplePaymentHistory[accountId] || []);
    }
  }, [accountId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${text} copied to clipboard.` });
  };

  if (!accountDetails) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-full">
          <p>Loading account details or account not found...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.push('/virtual-accounts')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="font-headline text-3xl font-semibold tracking-tight">Virtual Account Details</h1>
                <p className="text-muted-foreground">View information and payment history for {accountDetails.customId || accountDetails.id}.</p>
            </div>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Information</span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                  accountDetails.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {accountDetails.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground flex items-center"><Copy className="w-4 h-4 mr-2" />Account ID</Label>
              <div className="flex items-center">
                <p className="font-medium">{accountDetails.id}</p>
                <Button variant="ghost" size="sm" className="ml-1 h-7 w-7 p-0" onClick={() => copyToClipboard(accountDetails.id)}>
                    <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground flex items-center"><Copy className="w-4 h-4 mr-2" />Custom ID</Label>
               <div className="flex items-center">
                <p className="font-medium">{accountDetails.customId || '-'}</p>
                {accountDetails.customId && 
                    <Button variant="ghost" size="sm" className="ml-1 h-7 w-7 p-0" onClick={() => copyToClipboard(accountDetails.customId)}>
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                }
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground flex items-center"><Info className="w-4 h-4 mr-2" />Purpose</Label>
              <p className="font-medium">{accountDetails.purpose}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-2" />Creation Date</Label>
              <p className="font-medium">{new Date(accountDetails.creationDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground flex items-center"><DollarSign className="w-4 h-4 mr-2" />Current Balance</Label>
              <p className="font-bold text-xl">${accountDetails.balance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="w-6 h-6 mr-2 text-primary" />Payment History</CardTitle>
            <CardDescription>Recent transactions associated with this virtual account.</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payment history for this account.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                            }`}>
                            {tx.status}
                            </span>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${tx.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                          {tx.type === 'Deposit' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
