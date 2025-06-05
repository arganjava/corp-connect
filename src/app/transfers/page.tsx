'use client';

import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { DollarSign, Users, Info, Send } from 'lucide-react';

export default function TransfersPage() {
  const { toast } = useToast();

  const handleSingleTransfer = (event: React.FormEvent) => {
    event.preventDefault();
    // Add single transfer logic here
    toast({
      title: "Transfer Initiated",
      description: "Your single transfer has been successfully initiated.",
    });
    (event.target as HTMLFormElement).reset();
  };

  const handleMultiTransferFile = (file: File) => {
    // Add multi-transfer file processing logic here
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded for multi-transfer processing.`,
    });
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Funds Transfer</h1>
          <p className="text-muted-foreground">Initiate single or bulk transfers securely.</p>
        </header>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
            <TabsTrigger value="single">
              <DollarSign className="mr-2 h-4 w-4" /> Single Transfer
            </TabsTrigger>
            <TabsTrigger value="multi">
              <Users className="mr-2 h-4 w-4" /> Multi Transfer
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
                      <Input id="recipientAccount" type="text" placeholder="e.g., 0987654321" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input id="recipientName" type="text" placeholder="e.g., John Doe Services" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input id="amount" type="number" placeholder="e.g., 1500.00" required step="0.01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transferDate">Transfer Date</Label>
                      <Input id="transferDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description / Reference</Label>
                    <Textarea id="description" placeholder="e.g., Invoice #INV-2023-001 payment" required />
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
        </Tabs>
      </div>
    </AppShell>
  );
}
