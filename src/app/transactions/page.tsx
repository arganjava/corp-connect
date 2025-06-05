'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/DatePickerWithRange'; // Assume this component exists
import type { DateRange } from "react-day-picker";
import { Download, Filter, Search } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'Single Transfer' | 'Multi Transfer' | 'VA Deposit' | 'VA Withdrawal' | 'Fee';
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  sourceDest: string; // Source or Destination Account/Name
}

const initialTransactions: Transaction[] = [
  { id: 'TXN001', date: '2024-07-20', type: 'Single Transfer', description: 'Payment for INV-2024-101', amount: -1500.00, status: 'Completed', sourceDest: 'Supplier Corp' },
  { id: 'TXN002', date: '2024-07-19', type: 'VA Deposit', description: 'Deposit from Client X (VA: CLIENTX-01)', amount: 5000.00, status: 'Completed', sourceDest: 'Client X' },
  { id: 'TXN003', date: '2024-07-18', type: 'Multi Transfer', description: 'July Salary Payments', amount: -25000.00, status: 'Completed', sourceDest: 'Bulk Payroll' },
  { id: 'TXN004', date: '2024-07-17', type: 'Fee', description: 'Monthly Account Fee', amount: -25.00, status: 'Completed', sourceDest: 'CorpConnect' },
  { id: 'TXN005', date: '2024-07-16', type: 'Single Transfer', description: 'Office Supplies Purchase', amount: -250.75, status: 'Pending', sourceDest: 'Stationery World' },
  { id: 'TXN006', date: '2024-07-15', type: 'VA Deposit', description: 'Refund from Vendor Y (VA: PROJECT-REFUND)', amount: 750.00, status: 'Completed', sourceDest: 'Vendor Y' },
  { id: 'TXN007', date: '2024-07-14', type: 'Single Transfer', description: 'Consulting Services', amount: -5000.00, status: 'Failed', sourceDest: 'Advisor Group' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [transactionType, setTransactionType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.sourceDest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateRange || !dateRange.from || !dateRange.to || 
                          (new Date(tx.date) >= dateRange.from && new Date(tx.date) <= dateRange.to);

      const matchesType = transactionType === 'all' || tx.type === transactionType;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

      return matchesSearch && matchesDate && matchesType && matchesStatus;
    });
  }, [searchTerm, dateRange, transactionType, statusFilter]);

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">View and filter all your account transactions.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID, description, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" />
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Single Transfer">Single Transfer</SelectItem>
                  <SelectItem value="Multi Transfer">Multi Transfer</SelectItem>
                  <SelectItem value="VA Deposit">VA Deposit</SelectItem>
                  <SelectItem value="VA Withdrawal">VA Withdrawal</SelectItem>
                  <SelectItem value="Fee">Fee</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="flex justify-end mt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
               <p className="text-center text-muted-foreground py-8">No transactions match your filters.</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Source/Destination</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>{tx.sourceDest}</TableCell>
                      <TableCell className={`text-right font-semibold ${tx.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        ${Math.abs(tx.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
             {/* Placeholder for pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                <Button variant="outline" size="sm" disabled={filteredTransactions.length < 10}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
