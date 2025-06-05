'use client';

import AppShell from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Banknote, Building, Landmark, UserCircle, Phone } from 'lucide-react';

export default function AccountSetupPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add account setup logic here
    toast({
      title: "Account Updated",
      description: "Your bank account details have been saved successfully.",
      variant: "default",
    });
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-3xl mx-auto">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight">Bank Account Setup</h1>
          <p className="text-muted-foreground">Manage your primary bank account details for operations within CorpConnect.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Landmark className="mr-2 h-6 w-6 text-primary" />
              Your Bank Details
            </CardTitle>
            <CardDescription>Provide accurate information for your bank account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    Bank Name
                  </Label>
                  <Input id="bankName" type="text" placeholder="e.g., First National Bank" defaultValue="First National Bank" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    Account Holder Name
                  </Label>
                  <Input id="accountName" type="text" placeholder="e.g., Your Company LLC" defaultValue="CorpConnect Demo Bank" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="flex items-center">
                    <Banknote className="mr-2 h-4 w-4 text-muted-foreground" />
                    Account Number
                  </Label>
                  <Input id="accountNumber" type="text" placeholder="e.g., 1234567890" defaultValue="100200300" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchCode" className="flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-muted-foreground"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    Branch Code / Swift Code
                  </Label>
                  <Input id="branchCode" type="text" placeholder="e.g., FNBKUS33" defaultValue="CCDEX001" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAddress" className="flex items-center">
                  <Landmark className="mr-2 h-4 w-4 text-muted-foreground" />
                  Bank Address
                </Label>
                <Textarea id="bankAddress" placeholder="Enter bank's full address" defaultValue="123 Finance Street, Capital City, USA" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="flex items-center">
                  <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  Contact Person at Bank (Optional)
                </Label>
                <Input id="contactPerson" type="text" placeholder="e.g., Jane Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                   Contact Phone (Optional)
                </Label>
                <Input id="contactPhone" type="tel" placeholder="e.g., +1-555-0100" />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="min-w-[120px]">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
