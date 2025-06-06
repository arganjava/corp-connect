
'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { DollarSign, Users, Info, Send, ListOrdered, Download } from 'lucide-react';

interface TransferItem {
  id: string;
  date: string;
  recipientName: string;
  recipientAccount: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Single' | 'Bulk';
}

const initialTransfers: TransferItem[] = [
  { id: 'TRN001', date: '2024-07-22', recipientName: 'Supplier ABC', recipientAccount: '****7890', amount: 1250.00, status: 'Completed', type: 'Single' },
  { id: 'TRN002', date: '2024-07-21', recipientName: 'Bulk Payroll July', recipientAccount: 'MULTIPLE', amount: 15000.00, status: 'Completed', type: 'Bulk' },
  { id: 'TRN003', date: '2024-07-20', recipientName: 'Consultant XYZ', recipientAccount: '****1234', amount: 3000.00, status: 'Pending', type: 'Single' },
  { id: 'TRN004', date: '2024-07-19', recipientName: 'Vendor Services', recipientAccount: '****5678', amount: 500.00, status: 'Failed', type: 'Single' },
];


export default function TransfersPage() {
  const { toast } = useToast();
  const [recentTransfers, setRecentTransfers] = useState<TransferItem[]>(initialTransfers);

  const handleSingleTransfer = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const newTransfer: TransferItem = {
      id: `TRN${String(recentTransfers.length + 1).padStart(3, '0')}`,
      date: formData.get('transferDate') as string || new Date().toISOString().split('T')[0],
      recipientName: formData.get('recipientName') as string,
      recipientAccount: `****${(formData.get('recipientAccount') as string).slice(-4)}`,
      amount: parseFloat(formData.get('amount') as string),
      status: 'Pending',
      type: 'Single',
    };
    setRecentTransfers(prev => [newTransfer, ...prev]);
    toast({
      title: "Transfer Initiated",
      description: "Your single transfer has been successfully initiated.",
    });
    form.reset();
  };

  const handleMultiTransferFile = (file: File) => {
    // Add multi-transfer file processing logic here
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded for multi-transfer processing.`,
    });
     // Simulate adding a bulk transfer entry
    const newBulkTransfer: TransferItem = {
      id: `TRN${String(recentTransfers.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      recipientName: `Bulk from ${file.name}`,
      recipientAccount: 'MULTIPLE',
      amount: 0, // This would be calculated from file
      status: 'Pending',
      type: 'Bulk',
    };
    setRecentTransfers(prev => [newBulkTransfer, ...prev]);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Funds Transfer</h1>
          <p className="text-muted-foreground">Initiate single or bulk transfers securely.</p>
        </header>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6">
            <TabsTrigger value="single">
              <DollarSign className="mr-2 h-4 w-4" /> Single Transfer
            </TabsTrigger>
            <TabsTrigger value="multi">
              <Users className="mr-2 h-4 w-4" /> Multi Transfer
            </TabsTrigger>
            <TabsTrigger value="list">
              <ListOrdered className="mr-2 h-4 w-4" /> List of Transfers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Single Fund Transfer</CardTitle>
                <CardDescription>Enter details for a one-time transfer.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSingleTransfer} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="recipientAccount">Recipient Account Number</Label>
                      <Input id="recipientAccount" name="recipientAccount" type="text" placeholder="e.g., 0987654321" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input id="recipientName" name="recipientName" type="text" placeholder="e.g., John Doe Services" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input id="amount" name="amount" type="number" placeholder="e.g., 1500.00" required step="0.01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transferDate">Transfer Date</Label>
                      <Input id="transferDate" name="transferDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description / Reference</Label>
                    <Textarea id="description" name="description" placeholder="e.g., Invoice #INV-2023-001 payment" required />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="min-w-[150px]">
                      <Send className="mr-2 h-4 w-4" /> Initiate Transfer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multi">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Multi Transfer via Excel Upload</CardTitle>
                <CardDescription>Upload an Excel file with multiple transfer details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-accent/20 border border-accent/50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mr-3 mt-1 text-accent" />
                    <div>
                      <h4 className="font-semibold text-accent-foreground">Excel File Format Instructions</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                        <li>Ensure your Excel file (.xlsx or .xls) or CSV file (.csv) has the following columns in order:</li>
                        <li><b>Column A:</b> Recipient Account Number</li>
                        <li><b>Column B:</b> Recipient Name</li>
                        <li><b>Column C:</b> Amount</li>
                        <li><b>Column D:</b> Description/Reference</li>
                        <li>The first row should be headers. Data starts from the second row.</li>
                        <li>Max 500 transactions per file.</li>
                      </ul>
                      <Button variant="link" className="p-0 h-auto mt-2 text-accent-foreground hover:underline">
                        Download Sample Template
                      </Button>
                    </div>
                  </div>
                </div>
                
                <FileUpload onFileAccepted={handleMultiTransferFile} />

                <div className="flex justify-end pt-2">
                  <Button disabled /* Enable after file is processed by backend */ className="min-w-[180px]">
                    <Send className="mr-2 h-4 w-4" /> Process Bulk Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>A list of your recent fund transfers.</CardDescription>
                 <div className="flex justify-end pt-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export List
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransfers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transfers made yet.</p>
                ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transfer ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Recipient Name</TableHead>
                        <TableHead>Recipient Account</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-medium">{transfer.id}</TableCell>
                          <TableCell>{new Date(transfer.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transfer.recipientName}</TableCell>
                          <TableCell>{transfer.recipientAccount}</TableCell>
                          <TableCell>{transfer.type}</TableCell>
                          <TableCell className="text-right font-semibold text-destructive">
                            ${transfer.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              transfer.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                              transfer.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {transfer.status}
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
                    <Button variant="outline" size="sm" disabled={recentTransfers.length < 10}>Next</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

    