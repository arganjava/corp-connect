
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
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import type { DateRange } from "react-day-picker";
import { Search, Download, Activity as ActivityIcon } from 'lucide-react'; // Renamed to avoid conflict
import { format } from 'date-fns';

interface UserActivityLog {
  id: string;
  timestamp: string; // ISO string
  userName: string;
  action: string; 
  details: string; 
  ipAddress?: string;
}

const initialActivityLogs: UserActivityLog[] = [
  { id: 'LOG001', timestamp: '2024-07-28T10:00:00Z', userName: 'Alice Johnson', action: 'Logged In', details: 'Successful login via web.', ipAddress: '192.168.1.10' },
  { id: 'LOG002', timestamp: '2024-07-28T10:05:00Z', userName: 'Alice Johnson', action: 'Viewed Dashboard', details: 'Accessed main dashboard page.', ipAddress: '192.168.1.10' },
  { id: 'LOG003', timestamp: '2024-07-27T15:30:00Z', userName: 'Bob Williams', action: 'Created Transfer', details: 'Transfer ID: TRN005 to Supplier XYZ for $500.', ipAddress: '203.0.113.45' },
  { id: 'LOG004', timestamp: '2024-07-27T14:00:00Z', userName: 'Alice Johnson', action: 'Updated User Profile', details: 'Changed phone number for user usr_003.', ipAddress: '192.168.1.10' },
  { id: 'LOG005', timestamp: '2024-07-26T09:15:00Z', userName: 'System Admin', action: 'Deleted Virtual Account', details: 'VA ID: VA003 (Marketing Campaign Q3)', ipAddress: '10.0.0.1' },
  { id: 'LOG006', timestamp: '2024-07-26T11:00:00Z', userName: 'Eve Wilson', action: 'Generated VA', details: 'VA ID: VA011 (Client D Payments)', ipAddress: '172.16.0.5' },
  { id: 'LOG007', timestamp: '2024-07-25T16:45:00Z', userName: 'Bob Williams', action: 'Logged Out', details: 'User logged out successfully.', ipAddress: '203.0.113.45' },
];

const ACTION_TYPES = ['All', 'Logged In', 'Logged Out', 'Viewed Page', 'Created Item', 'Updated Item', 'Deleted Item', 'Generated Report', 'System Event'];
const ITEMS_PER_PAGE = 10;

export default function UserActivityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('All');
  const [userFilter, setUserFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivityLogs = useMemo(() => {
    return initialActivityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const matchesSearch = searchTerm === '' ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDate = !dateRange || !dateRange.from || !dateRange.to || 
                          (logDate >= dateRange.from && logDate <= dateRange.to);

      const matchesActionType = actionTypeFilter === 'All' || log.action.toLowerCase().includes(actionTypeFilter.toLowerCase());
      const matchesUser = userFilter === '' || log.userName.toLowerCase().includes(userFilter.toLowerCase());

      return matchesSearch && matchesDate && matchesActionType && matchesUser;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by most recent
  }, [searchTerm, dateRange, actionTypeFilter, userFilter]);

  const paginatedActivityLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActivityLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredActivityLogs, currentPage]);

  const totalPages = Math.ceil(filteredActivityLogs.length / ITEMS_PER_PAGE);

  const handleExport = () => {
    // Placeholder for CSV export functionality
    console.log("Exporting data...", filteredActivityLogs);
    alert("CSV export functionality to be implemented.");
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-headline text-3xl font-semibold tracking-tight flex items-center">
             <ActivityIcon className="mr-3 h-8 w-8 text-primary" /> User Activity History
          </h1>
          <p className="text-muted-foreground">Monitor user actions and system events across the application.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Activity Logs</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
              <DatePickerWithRange date={dateRange} onDateChange={(newRange) => { setDateRange(newRange); setCurrentPage(1);}} className="w-full" />
              <Select value={actionTypeFilter} onValueChange={(value) => { setActionTypeFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Action Type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Filter by User Name..."
                value={userFilter}
                onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
              />
            </div>
             <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" /> Export Logs (CSV)
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedActivityLogs.length === 0 ? (
               <p className="text-center text-muted-foreground py-8">No activity logs match your filters.</p>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedActivityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                      <TableCell>{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
