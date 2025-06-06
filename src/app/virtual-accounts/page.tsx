
'use client';

import React, { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Copy, Eye, Trash2, Edit3 } from 'lucide-react';
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
];

export default function VirtualAccountsPage() {
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>(initialVirtualAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVACustomId, setNewVACustomId] = useState('');
  const [newVAPurpose, setNewVAPurpose] = useState('');
  const { toast } = useToast();

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
    setVirtualAccounts(virtualAccounts.filter(va => va.id !== vaId));
    toast({
      title: "Virtual Account Deleted",
      description: `Virtual account ${vaId} has been deleted.`,
      variant: "destructive"
    });
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
          </CardHeader>
          <CardContent>
            {virtualAccounts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No virtual accounts generated yet.</p>
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
                  {virtualAccounts.map((va) => (
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
