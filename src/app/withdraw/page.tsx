
'use client';

import React, { useState } from 'react';
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
import { DollarSign, Landmark, Send, Info, History, Download, PlusCircle } from 'lucide-react';

interface WithdrawalHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Processed' | 'Failed';
  destinationBank: string;
  description?: string;
}

const initialWithdrawalHistory: WithdrawalHistoryItem[] = [
  { id: 'WTH001', date: '2024-07-20', amount: 500.00, status: 'Processed', destinationBank: 'Primary Account (****300)', description: 'Monthly savings' },
  { id: 'WTH002', date: '2024-07-15', amount: 1200.00, status: 'Processed', destinationBank: 'Primary Account (****300)', description: 'Expense reimbursement' },
  { id: 'WTH003', date: '2024-07-10', amount: 300.00, status: 'Failed', destinationBank: 'Primary Account (****300)', description: 'Ad-hoc withdrawal' },
];

export default function WithdrawPage() {
  const { toast } = useToast();
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistoryItem[]>(initialWithdrawalHistory);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);

  const handleWithdrawal = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newWithdrawal: WithdrawalHistoryItem = {
      id: `WTH${String(withdrawalHistory.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      status: 'Pending',
      destinationBank: 'Primary Account (****300)', // Assuming this is always the primary
      description: description || undefined,
    };

    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
    
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal request for $${parseFloat(amount).toFixed(2)} has been submitted.`,
    });
    
    setAmount('');
    setDescription('');
    setIsWithdrawalDialogOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight">Withdraw Funds</h1>
            <p className="text-muted-foreground">Request a withdrawal and view your withdrawal history.</p>
          </div>
          <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 min-w-[200px]">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Withdrawal Request</DialogTitle>
                <DialogDescription>Enter the details for your withdrawal.</DialogDescription>
              </DialogHeader>
              <div className="p-4 my-4 bg-accent/20 border border-accent/50 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-accent" />
                  <div>
                    <h4 className="font-semibold text-accent-foreground">Important Information</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Withdrawals will be processed to your primary bank account configured in Account Setup.
                      Processing times may vary.
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleWithdrawal} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amountForm" className="flex items-center">
                     <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                     Amount to Withdraw ($)
                  </Label>
                  <Input 
                    id="amountForm" 
                    type="number" 
                    placeholder="e.g., 500.00" 
                    required 
                    step="0.01" 
                    min="0.01" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                   <Label htmlFor="bankInfoForm" className="flex items-center">
                      <Landmark className="mr-2 h-4 w-4 text-muted-foreground" />
                      Destination Bank Account
                   </Label>
                   <Input id="bankInfoForm" type="text" defaultValue="Primary Linked Account (e.g., **** **** **** 300)" readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionForm" className="flex items-center">
                    <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                    Description / Reference (Optional)
                  </Label>
                  <Textarea 
                    id="descriptionForm" 
                    placeholder="e.g., Withdrawal for operational expenses" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsWithdrawalDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="min-w-[150px]">
                    <Send className="mr-2 h-4 w-4" /> Submit Withdrawal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Withdrawal History</CardTitle>
                    <CardDescription>List of your past withdrawal requests.</CardDescription>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export List
                </Button>
            </CardHeader>
            <CardContent>
                {withdrawalHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No withdrawal history yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Withdrawal ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawalHistory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.id}</TableCell>
                                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{item.description || '-'}</TableCell>
                                        <TableCell>{item.destinationBank}</TableCell>
                                        <TableCell className="text-right font-semibold text-destructive">
                                            ${item.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.status === 'Processed' ? 'bg-green-100 text-green-700' :
                                                item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={withdrawalHistory.length < 10}>Next</Button>
                </div>
            </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
