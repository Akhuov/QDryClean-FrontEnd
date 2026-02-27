import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const mockClients = [
  { id: '1', name: 'Sophia Clark', phone: '(555) 123-4567', email: 'sophia.clark@email.com', orders: 12, status: 'Active' },
  { id: '2', name: 'Ethan Bennett', phone: '(555) 987-6543', email: 'ethan.bennett@email.com', orders: 8, status: 'Active' },
  { id: '3', name: 'Olivia Carter', phone: '(555) 246-8013', email: 'olivia.carter@email.com', orders: 15, status: 'Active' },
  { id: '4', name: 'Liam Davis', phone: '(555) 365-1215', email: 'liam.davis@email.com', orders: 5, status: 'Inactive' },
  { id: '5', name: 'Ava Foster', phone: '(555) 482-5679', email: 'ava.foster@email.com', orders: 20, status: 'Active' },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone || !newClient.email) {
      alert('Please fill in all fields');
      return;
    }
    alert('Client added successfully!');
    setIsModalOpen(false);
    setNewClient({ name: '', phone: '', email: '' });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client database.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Full Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="bg-input-background border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Phone Number *</Label>
                <div className="relative">
                  <Input
                    id="clientPhone"
                    placeholder="(555) 123-4567"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="bg-input-background border-input pl-10"
                  />
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email Address *</Label>
                <div className="relative">
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@email.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="bg-input-background border-input pl-10"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <Button onClick={handleAddClient} className="w-full bg-primary hover:bg-primary/90">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search clients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input-background border-input pl-10"
              />
            </div>
            <Button variant="outline" className="border-input">
              <span className="text-muted-foreground">Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell className="text-center text-foreground">{client.orders}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        client.status === 'Active'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1 to {filteredClients.length} of {mockClients.length} clients
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="border-input">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground border-primary">
            1
          </Button>
          <Button variant="outline" size="sm" className="border-input">
            2
          </Button>
          <Button variant="outline" size="sm" className="border-input">
            3
          </Button>
          <Button variant="outline" size="sm" className="border-input">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
