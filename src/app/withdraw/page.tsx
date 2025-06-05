'use client';

import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Landmark, Send, Info } from 'lucide-react';

export default function WithdrawPage() {
  const { toast } = useToast();

  const handleWithdrawal = (event: React.FormEvent) => {
    event.preventDefault();
    // Add withdrawal logic here
    toast({
      title: "Withdrawal Initiated",
      description: "Your withdrawal request has been successfully submitted.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Withdraw Funds</h1>
          <p className="text-muted-foreground">Request a withdrawal from your wallet balance to your linked bank account.</p>
        </header>

        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
            <CardDescription>Enter the details for your withdrawal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 mb-6 bg-accent/20 border border-accent/50 rounded-lg">
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
                <Label htmlFor="amount" className="flex items-center">
                   <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                   Amount to Withdraw ($)
                </Label>
                <Input id="amount" type="number" placeholder="e.g., 500.00" required step="0.01" min="0.01" />
              </div>
              
              <div className="space-y-2">
                 <Label htmlFor="bankInfo" className="flex items-center">
                    <Landmark className="mr-2 h-4 w-4 text-muted-foreground" />
                    Destination Bank Account
                 </Label>
                 <Input id="bankInfo" type="text" defaultValue="Primary Linked Account (e.g., **** **** **** 300)" readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Reference (Optional)</Label>
                <Textarea id="description" placeholder="e.g., Withdrawal for operational expenses" />
              </div>
              
              <div className="flex justify-end pt-2">
                <Button type="submit" className="min-w-[180px]">
                  <Send className="mr-2 h-4 w-4" /> Submit Withdrawal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
