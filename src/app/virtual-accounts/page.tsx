
'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Copy, Eye, Trash2, Edit3, Search } from 'lucide-react';
import Link from 'next/link';

interface VirtualAccount {
  id: string;
  customId: string;
  purpose: string;
  creationDate: string;
  status: 'Active' | 'Inactive';
  balance: number;
}

const initialVirtualAccounts: VirtualAccount[] = [
  { id: 'VA001', customId: 'CLIENTCORP-A', purpose: 'Client A Payments', creationDate: '2023-05-10', status: 'Active', balance: 5500.00 },
  { id: 'VA002', customId: 'PROJECTX-FUNDS', purpose: 'Project X Funding', creationDate: '2023-06-15', status: 'Active', balance: 12030.50 },
  { id: 'VA003', customId: 'MARKETING-CAMP', purpose: 'Marketing Campaign Q3', creationDate: '2023-07-01', status: 'Inactive', balance: 0.00 },
  { id: 'VA004', customId: 'OPS-EXPENSE-01', purpose: 'Operational Expenses', creationDate: '2023-08-20', status: 'Active', balance: 1500.00 },
  { id: 'VA005', customId: 'CLIENTCORP-B', purpose: 'Client B Payments', creationDate: '2023-09-01', status: 'Active', balance: 8200.75 },
  { id: 'VA006', customId: 'SUBSCRIPTIONS', purpose: 'Software Subscriptions', creationDate: '2023-09-10', status: 'Inactive', balance: 50.00 },
  { id: 'VA007', customId: 'DEV-TEAM-BUDGET', purpose: 'Development Team Budget', creationDate: '2023-10-05', status: 'Active', balance: 25000.00 },
  { id: 'VA008', customId: 'PROJECTY-FUNDS', purpose: 'Project Y Funding', creationDate: '2023-11-12', status: 'Active', balance: 7500.00 },
  { id: 'VA009', customId: 'CLIENTCORP-C', purpose: 'Client C Payments', creationDate: '2024-01-15', status: 'Inactive', balance: 0.00 },
  { id: 'VA010', customId: 'TRAVEL-EXP-Q1', purpose: 'Q1 Travel Expenses', creationDate: '2024-02-01', status: 'Active', balance: 3200.00 },
];

const ITEMS_PER_PAGE = 5;

export default function VirtualAccountsPage() {
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>(initialVirtualAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVACustomId, setNewVACustomId] = useState('');
  const [newVAPurpose, setNewVAPurpose] = useState('');
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVirtualAccounts = useMemo(() => {
    return virtualAccounts.filter(va => {
      const matchesSearch = searchTerm === '' ||
        va.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        va.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        va.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || va.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [virtualAccounts, searchTerm, statusFilter]);

  const paginatedVirtualAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredVirtualAccounts.slice(startIndex, endIndex);
  }, [filteredVirtualAccounts, currentPage]);

  const totalPages = Math.ceil(filteredVirtualAccounts.length / ITEMS_PER_PAGE);

  const handleGenerateVA = (event: React.FormEvent) => {
    event.preventDefault();
    const newVA: VirtualAccount = {
      id: `VA${String(virtualAccounts.length + 1 + Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      customId: newVACustomId || `SYS-GEN-${Date.now().toString().slice(-4)}`,
      purpose: newVAPurpose,
      creationDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      balance: 0,
    };
    setVirtualAccounts([newVA, ...virtualAccounts]);
    toast({
      title: "Virtual Account Generated",
      description: `VA ${newVA.customId} for ${newVA.purpose} created successfully.`,
    });
    setIsDialogOpen(false);
    setNewVACustomId('');
    setNewVAPurpose('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${text} copied to clipboard.` });
  };
  
  const handleDeleteVA = (vaId: string) => {
    setVirtualAccounts(currentVAs => currentVAs.filter(va => va.id !== vaId));
    toast({
      title: "Virtual Account Deleted",
      description: `Virtual account ${vaId} has been deleted.`,
      variant: "destructive"
    });
     // Reset to first page if current page becomes empty after deletion
    if (paginatedVirtualAccounts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
    } else if (paginatedVirtualAccounts.length === 1 && currentPage === 1 && filteredVirtualAccounts.length > 1) {
        // If it's the last item on the first page but there are more items overall (due to filtering), stay on page 1.
        // This case is mostly handled by the filtering logic re-evaluating.
    } else if (filteredVirtualAccounts.length <= ITEMS_PER_PAGE * (currentPage -1) && currentPage > 1) {
        setCurrentPage(currentPage -1);
    }

  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight">Virtual Accounts</h1>
            <p className="text-muted-foreground">Manage and track your custom virtual accounts.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 min-w-[200px]">
                <PlusCircle className="mr-2 h-5 w-5" /> Generate New VA
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Generate New Virtual Account</DialogTitle>
                <DialogDescription>
                  Create a custom virtual account for specific tracking purposes.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGenerateVA} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customId">Custom Account ID (Optional)</Label>
                  <Input id="customId" value={newVACustomId} onChange={(e) => setNewVACustomId(e.target.value)} placeholder="e.g., CLIENT-XYZ-PROJECTA" />
                  <p className="text-xs text-muted-foreground">If left blank, a system ID will be generated.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input id="purpose" value={newVAPurpose} onChange={(e) => setNewVAPurpose(e.target.value)} placeholder="e.g., Payments for Project Alpha" required />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Generate Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Virtual Accounts</CardTitle>
            <CardDescription>List of all generated virtual accounts and their status.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search ID, Custom ID, Purpose..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as 'all' | 'Active' | 'Inactive'); setCurrentPage(1); }}>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredVirtualAccounts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No virtual accounts match your filters.</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Custom ID</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Creation Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVirtualAccounts.map((va) => (
                    <TableRow key={va.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {va.id}
                          <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={() => copyToClipboard(va.id)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{va.customId || '-'}</TableCell>
                      <TableCell>{va.purpose}</TableCell>
                      <TableCell>{va.creationDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          va.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {va.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${va.balance.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Link href={`/virtual-accounts/${va.id}`} passHref>
                            <Button variant="ghost" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                           <Button variant="ghost" size="icon" title="Edit (Placeholder)"> {/* Add edit functionality later */}
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteVA(va.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
