
'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Banknote, Building, Landmark, UserCircle, Phone, PlusCircle, Edit3, Trash2, CheckCircle2, Layers, Star } from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branchCode: string;
  bankAddress: string;
  contactPerson?: string;
  contactPhone?: string;
  isPrimary: boolean;
}

const initialBankAccounts: BankAccount[] = [
  {
    id: 'acc_1',
    bankName: 'First National Bank',
    accountHolderName: 'CorpConnect Demo Bank',
    accountNumber: '100200300',
    branchCode: 'FNBKUS33',
    bankAddress: '123 Finance Street, Capital City, USA',
    contactPerson: 'John Smith',
    contactPhone: '+1-555-0100',
    isPrimary: true,
  },
  {
    id: 'acc_2',
    bankName: 'Second Commercial Bank',
    accountHolderName: 'CorpConnect Operations',
    accountNumber: '987654321',
    branchCode: 'SCBUS002',
    bankAddress: '456 Commerce Ave, Business Town, USA',
    contactPerson: 'Alice Brown',
    contactPhone: '+1-555-0101',
    isPrimary: false,
  },
];

// Helper to mask account number
const maskAccountNumber = (accountNumber: string) => {
  if (accountNumber.length <= 4) return accountNumber;
  return `**** **** **** ${accountNumber.slice(-4)}`;
};

export default function AccountSetupPage() {
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Form state for adding/editing account
  const [formState, setFormState] = useState<Omit<BankAccount, 'id' | 'isPrimary'>>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    branchCode: '',
    bankAddress: '',
    contactPerson: '',
    contactPhone: '',
  });

  const resetFormState = () => {
    setFormState({
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      branchCode: '',
      bankAddress: '',
      contactPerson: '',
      contactPhone: '',
    });
  };

  const handleOpenAddDialog = () => {
    setEditingAccount(null);
    resetFormState();
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (account: BankAccount) => {
    setEditingAccount(account);
    setFormState({ ...account });
    setIsFormDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingAccount) {
      // Edit logic
      setBankAccounts(prevAccounts => 
        prevAccounts.map(acc => acc.id === editingAccount.id ? { ...editingAccount, ...formState } : acc)
      );
      toast({
        title: "Account Updated",
        description: `Bank account ${formState.bankName} details updated.`,
      });
    } else {
      // Add logic
      const newAccount: BankAccount = {
        id: `acc_${Date.now()}`,
        ...formState,
        isPrimary: bankAccounts.length === 0, // First account added is primary
      };
      setBankAccounts(prevAccounts => [newAccount, ...prevAccounts]);
      toast({
        title: "Account Added",
        description: `New bank account ${newAccount.bankName} added successfully.`,
      });
    }
    setIsFormDialogOpen(false);
    resetFormState();
  };

  const handleDeleteAccount = (accountId: string) => {
    const accountToDelete = bankAccounts.find(acc => acc.id === accountId);
    if (accountToDelete?.isPrimary && bankAccounts.filter(acc => !acc.isPrimary).length > 0 && bankAccounts.length > 1) {
         toast({
            title: "Action Denied",
            description: "Cannot delete the primary account if other accounts exist. Set another account as primary first.",
            variant: "destructive",
        });
        return;
    }
    if (accountToDelete?.isPrimary && bankAccounts.length === 1) {
         toast({
            title: "Action Denied",
            description: "Cannot delete the only bank account. Add another one first or edit this one.",
            variant: "destructive",
        });
        return;
    }
    setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
    toast({
      title: "Account Deleted",
      description: `Bank account has been deleted.`,
      variant: "destructive",
    });
  };

  const handleSetPrimary = (accountId: string) => {
    setBankAccounts(prev => 
      prev.map(acc => ({
        ...acc,
        isPrimary: acc.id === accountId,
      }))
    );
    toast({
      title: "Primary Account Updated",
      description: "The primary bank account has been changed.",
    });
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight">Bank Accounts Management</h1>
            <p className="text-muted-foreground">Manage your linked bank accounts for operations.</p>
          </div>
          <Button onClick={handleOpenAddDialog} className="mt-4 md:mt-0 min-w-[200px]">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Bank Account
          </Button>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Linked Bank Accounts</CardTitle>
            <CardDescription>List of all your configured bank accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccounts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bank accounts configured yet. Click "Add New Bank Account" to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account Holder</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Branch Code</TableHead>
                      <TableHead className="text-center">Primary</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.bankName}</TableCell>
                        <TableCell>{account.accountHolderName}</TableCell>
                        <TableCell>{maskAccountNumber(account.accountNumber)}</TableCell>
                        <TableCell>{account.branchCode}</TableCell>
                        <TableCell className="text-center">
                          {account.isPrimary ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(account.id)} title="Set as Primary">
                              <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" title="Edit Account" onClick={() => handleOpenEditDialog(account)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete Account" onClick={() => handleDeleteAccount(account.id)} disabled={account.isPrimary && bankAccounts.length === 1}>
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

        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update the details for this bank account.' : 'Provide accurate information for the new bank account.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    Bank Name
                  </Label>
                  <Input id="bankName" type="text" placeholder="e.g., First National Bank" value={formState.bankName} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    Account Holder Name
                  </Label>
                  <Input id="accountHolderName" type="text" placeholder="e.g., Your Company LLC" value={formState.accountHolderName} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="flex items-center">
                    <Banknote className="mr-2 h-4 w-4 text-muted-foreground" />
                    Account Number
                  </Label>
                  <Input id="accountNumber" type="text" placeholder="e.g., 1234567890" value={formState.accountNumber} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchCode" className="flex items-center">
                     <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                    Branch Code / Swift Code
                  </Label>
                  <Input id="branchCode" type="text" placeholder="e.g., FNBKUS33" value={formState.branchCode} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAddress" className="flex items-center">
                  <Landmark className="mr-2 h-4 w-4 text-muted-foreground" />
                  Bank Address
                </Label>
                <Textarea id="bankAddress" placeholder="Enter bank's full address" value={formState.bankAddress} onChange={handleFormChange} required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    Contact Person at Bank (Optional)
                  </Label>
                  <Input id="contactPerson" type="text" placeholder="e.g., Jane Doe" value={formState.contactPerson} onChange={handleFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    Contact Phone (Optional)
                  </Label>
                  <Input id="contactPhone" type="tel" placeholder="e.g., +1-555-0100" value={formState.contactPhone} onChange={handleFormChange} />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="min-w-[120px]">
                  {editingAccount ? 'Save Changes' : 'Add Account'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
