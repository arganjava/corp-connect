
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit3, Trash2, UserCog, Mail, Shield, LogIn, Search, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type UserRole = 'Admin' | 'Manager' | 'User';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
}

const initialUsers: User[] = [
  { id: 'usr_001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-07-25 10:00 AM' },
  { id: 'usr_002', name: 'Bob Williams', email: 'bob@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-07-24 03:15 PM' },
  { id: 'usr_003', name: 'Carol Davis', email: 'carol@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-07-20 09:30 AM' },
  { id: 'usr_004', name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Pending', lastLogin: null },
  { id: 'usr_005', name: 'Eve Wilson', email: 'eve@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-07-26 11:00 AM' },
];

const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'User'];
const USER_STATUSES: UserStatus[] = ['Active', 'Inactive', 'Pending'];
const ITEMS_PER_PAGE = 5;

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formState, setFormState] = useState<Omit<User, 'id' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'User',
    status: 'Pending',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });

  const resetFormState = () => {
    setFormState({ name: '', email: '', role: 'User', status: 'Pending' });
  };

  const handleOpenAddDialog = () => {
    setEditingUser(null);
    resetFormState();
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user);
    setFormState({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsFormDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'role' | 'status', value: string) => {
    setFormState(prev => ({ ...prev, [id]: value as UserRole | UserStatus }));
  };
  
  const handleSwitchChange = (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast({
      title: "User Status Updated",
      description: `User ${userId} status changed to ${newStatus}.`,
    });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingUser) {
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === editingUser.id ? { ...editingUser, ...formState } : user))
      );
      toast({ title: "User Updated", description: `User ${formState.name} details updated.` });
    } else {
      const newUser: User = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        ...formState,
        lastLogin: null,
      };
      setUsers(prevUsers => [newUser, ...prevUsers]);
      toast({ title: "User Added", description: `New user ${newUser.name} added successfully.` });
    }
    setIsFormDialogOpen(false);
    resetFormState();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({ title: "User Deleted", description: `User ${userId} has been deleted.`, variant: "destructive" });
    if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key!] === null) return 1;
        if (b[sortConfig.key!] === null) return -1;
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);
  
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(user => {
      const matchesSearch = searchTerm === '' ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [sortedUsers, searchTerm, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const renderSortIcon = (columnKey: keyof User) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="h-3 w-3 ml-1 opacity-30 group-hover:opacity-100" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />;
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight flex items-center">
              <UserCog className="mr-3 h-8 w-8 text-primary" /> User & Role Management
            </h1>
            <p className="text-muted-foreground">Manage users, roles, and access permissions.</p>
          </div>
          <Button onClick={handleOpenAddDialog} className="mt-4 md:mt-0 min-w-[180px]">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New User
          </Button>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Browse and manage system users.</CardDescription>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID, Name, Email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value as UserRole | 'all'); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {USER_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as UserStatus | 'all'); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {USER_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users match your filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('id')}>User ID {renderSortIcon('id')}</TableHead>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</TableHead>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('email')}>Email {renderSortIcon('email')}</TableHead>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('role')}>Role {renderSortIcon('role')}</TableHead>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</TableHead>
                      <TableHead className="cursor-pointer group" onClick={() => handleSort('lastLogin')}>Last Login {renderSortIcon('lastLogin')}</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>{user.role}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                                id={`status-switch-${user.id}`}
                                checked={user.status === 'Active'}
                                onCheckedChange={() => handleSwitchChange(user.id, user.status)}
                                disabled={user.status === 'Pending'}
                            />
                            <Label htmlFor={`status-switch-${user.id}`} className={`text-xs font-semibold ${
                                user.status === 'Active' ? 'text-green-700' :
                                user.status === 'Inactive' ? 'text-red-700' :
                                'text-yellow-700'
                            }`}>{user.status}</Label>
                           </div>
                        </TableCell>
                        <TableCell>{user.lastLogin || 'Never'}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" title="Edit User" onClick={() => handleOpenEditDialog(user)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete User" onClick={() => handleDeleteUser(user.id)}>
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
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update the details for this user.' : 'Provide information for the new user.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</Label>
                <Input id="name" placeholder="e.g., John Doe" value={formState.name} onChange={handleFormChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</Label>
                <Input id="email" type="email" placeholder="e.g., john.doe@example.com" value={formState.email} onChange={handleFormChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-muted-foreground" />Role</Label>
                  <Select value={formState.role} onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center"><LogIn className="mr-2 h-4 w-4 text-muted-foreground" />Status</Label>
                  <Select value={formState.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger id="status"><SelectValue placeholder="Select a status" /></SelectTrigger>
                    <SelectContent>
                       {USER_STATUSES.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingUser ? 'Save Changes' : 'Add User'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

