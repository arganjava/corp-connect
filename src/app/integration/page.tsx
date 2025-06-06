
'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import type { DateRange } from "react-day-picker";
import { PlugZap, KeyRound, Copy, Eye, EyeOff, Save, Search, Download, Info, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface CallbackLog {
  id: string;
  timestamp: string; // ISO string
  virtualAccountId: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  httpStatusCode: number;
  requestPayloadPreview: string;
  responsePayloadPreview: string;
}

const generateMockToken = () => `corp_tk_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 15)}`;

const initialCallbackLogs: CallbackLog[] = [
  { id: 'CB001', timestamp: '2024-07-30T10:00:00Z', virtualAccountId: 'VA001', amount: 150.75, status: 'Success', httpStatusCode: 200, requestPayloadPreview: '{"tx_id": "PAY123", ...}', responsePayloadPreview: '{"status": "ok"}' },
  { id: 'CB002', timestamp: '2024-07-30T11:30:00Z', virtualAccountId: 'VA002', amount: 2000.00, status: 'Failed', httpStatusCode: 500, requestPayloadPreview: '{"tx_id": "PAY124", ...}', responsePayloadPreview: '{"error": "Internal Server Error"}' },
  { id: 'CB003', timestamp: '2024-07-29T15:00:00Z', virtualAccountId: 'VA001', amount: 50.00, status: 'Success', httpStatusCode: 200, requestPayloadPreview: '{"tx_id": "PAY122", ...}', responsePayloadPreview: '{"status": "ok"}' },
  { id: 'CB004', timestamp: '2024-07-28T09:20:00Z', virtualAccountId: 'VA003', amount: 1000.00, status: 'Pending', httpStatusCode: 202, requestPayloadPreview: '{"tx_id": "PAY121", ...}', responsePayloadPreview: '{"status": "accepted"}' },
  { id: 'CB005', timestamp: '2024-07-28T14:05:00Z', virtualAccountId: 'VA002', amount: 75.50, status: 'Success', httpStatusCode: 200, requestPayloadPreview: '{"tx_id": "PAY120", ...}', responsePayloadPreview: '{"status": "ok"}' },
];

const LOG_STATUS_TYPES = ['All', 'Success', 'Failed', 'Pending'];
const LOGS_PER_PAGE = 10;

export default function IntegrationPage() {
  const { toast } = useToast();
  const [hasMounted, setHasMounted] = useState(false);

  const [apiToken, setApiToken] = useState(generateMockToken());
  const [isTokenRevealed, setIsTokenRevealed] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState('https://api.examplecorp.com/webhook/payment');
  const [tempCallbackUrl, setTempCallbackUrl] = useState(callbackUrl);

  const [callbackLogs, setCallbackLogs] = useState<CallbackLog[]>(initialCallbackLogs);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logDateRange, setLogDateRange] = useState<DateRange | undefined>(undefined);
  const [logStatusFilter, setLogStatusFilter] = useState<string>('All');
  const [logCurrentPage, setLogCurrentPage] = useState(1);

  useEffect(() => {
    setHasMounted(true);
    setTempCallbackUrl(callbackUrl);
  }, [callbackUrl]);

  const handleGenerateToken = () => {
    const newToken = generateMockToken();
    setApiToken(newToken);
    setIsTokenRevealed(false);
    toast({
      title: "API Token Generated",
      description: "A new API token has been generated. Keep it secure.",
    });
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiToken);
    toast({ title: "Copied!", description: "API Token copied to clipboard." });
  };

  const handleSaveCallbackUrl = () => {
    setCallbackUrl(tempCallbackUrl);
    toast({
      title: "Callback URL Updated",
      description: "Your webhook callback URL has been saved.",
    });
  };
  
  const filteredCallbackLogs = useMemo(() => {
    return callbackLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const matchesSearch = logSearchTerm === '' ||
        log.virtualAccountId.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.requestPayloadPreview.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.responsePayloadPreview.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(logSearchTerm.toLowerCase());
      
      const matchesDate = !logDateRange || !logDateRange.from || !logDateRange.to || 
                          (logDate >= logDateRange.from && logDate <= logDateRange.to);

      const matchesStatus = logStatusFilter === 'All' || log.status === logStatusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [callbackLogs, logSearchTerm, logDateRange, logStatusFilter]);

  const paginatedCallbackLogs = useMemo(() => {
    const startIndex = (logCurrentPage - 1) * LOGS_PER_PAGE;
    return filteredCallbackLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
  }, [filteredCallbackLogs, logCurrentPage]);

  const totalLogPages = Math.ceil(filteredCallbackLogs.length / LOGS_PER_PAGE);

  const handleExportLogs = () => {
    toast({
      title: "Export Logs",
      description: "CSV export functionality for logs is not yet implemented.",
      variant: "default"
    });
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight flex items-center">
            <PlugZap className="mr-3 h-8 w-8 text-primary" /> Integration Settings & Logs
          </h1>
          <p className="text-muted-foreground">Manage API access and webhook configurations for your integrations.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" /> API Configuration</CardTitle>
              <CardDescription>Manage your secret API token for secure programmatic access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiTokenDisplay">Your API Token</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="apiTokenDisplay"
                    type={isTokenRevealed ? 'text' : 'password'}
                    value={apiToken}
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => setIsTokenRevealed(!isTokenRevealed)} title={isTokenRevealed ? "Hide Token" : "Reveal Token"}>
                    {isTokenRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleCopyToken} title="Copy Token">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Keep this token confidential. Treat it like a password.</p>
              </div>
              <Button onClick={handleGenerateToken}>Generate New Token</Button>
               <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                Generating a new token will invalidate the current one immediately. Ensure all applications are updated.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary" /> Webhook Configuration</CardTitle>
              <CardDescription>Set up a callback URL to receive real-time notifications for incoming VA payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="callbackUrl">Callback URL for Incoming Payments</Label>
                <Input
                  id="callbackUrl"
                  type="url"
                  placeholder="https://yourdomain.com/webhook/payments"
                  value={tempCallbackUrl}
                  onChange={(e) => setTempCallbackUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">We will send a POST request with payment details to this URL.</p>
              </div>
              <Button onClick={handleSaveCallbackUrl} className="min-w-[150px]">
                <Save className="mr-2 h-4 w-4" /> Save Callback URL
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Callback Log History</CardTitle>
            <CardDescription>Review the history of webhook notifications sent for incoming payments.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="relative md:col-span-1 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs (VA ID, payload...)"
                  value={logSearchTerm}
                  onChange={(e) => { setLogSearchTerm(e.target.value); setLogCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
              <DatePickerWithRange date={logDateRange} onDateChange={(newRange) => { setLogDateRange(newRange); setLogCurrentPage(1);}} className="w-full md:col-span-1 lg:col-span-1" />
              <Select value={logStatusFilter} onValueChange={(value) => { setLogStatusFilter(value); setLogCurrentPage(1); }}>
                <SelectTrigger className="w-full md:col-span-1 lg:col-span-1">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  {LOG_STATUS_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex justify-end items-center md:col-span-2 lg:col-span-1">
                <Button variant="outline" onClick={handleExportLogs} className="w-full md:w-auto">
                  <Download className="mr-2 h-4 w-4" /> Export Logs
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedCallbackLogs.length === 0 ? (
               <p className="text-center text-muted-foreground py-8">No callback logs match your filters or no logs available.</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Log ID</TableHead>
                    <TableHead>VA ID</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">HTTP Code</TableHead>
                    <TableHead>Details (Preview)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCallbackLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {hasMounted ? format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss") : log.timestamp.substring(0, 10)}
                      </TableCell>
                       <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.virtualAccountId}</TableCell>
                      <TableCell className="text-right">${log.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'Success' ? 'bg-green-100 text-green-700' :
                          log.status === 'Failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{log.httpStatusCode}</TableCell>
                      <TableCell className="max-w-xs truncate text-xs font-mono" title={`Request: ${log.requestPayloadPreview} | Response: ${log.responsePayloadPreview}`}>
                        Req: {log.requestPayloadPreview} <br/> Resp: {log.responsePayloadPreview}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
            {totalLogPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" onClick={() => setLogCurrentPage(prev => Math.max(1, prev - 1))} disabled={logCurrentPage === 1}>Previous</Button>
                  <span className="text-sm text-muted-foreground">Page {logCurrentPage} of {totalLogPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setLogCurrentPage(prev => Math.min(totalLogPages, prev + 1))} disabled={logCurrentPage === totalLogPages}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
