import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const mockClients = [
  { id: '1', name: 'Sophia Clark' },
  { id: '2', name: 'Ethan Bennett' },
  { id: '3', name: 'Olivia Carter' },
  { id: '4', name: 'Liam Davis' },
];

const serviceTypes = ['Express Cleaning', 'Standard Cleaning', 'Deep Cleaning', 'Carpet Cleaning'];

export default function OrdersPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleCreateOrder = () => {
    // Mock order creation
    alert('Order created successfully!');
    setOrderNumber('');
    setSelectedClient('');
    setServiceType('');
    setPrice('');
    setComment('');
  };

  const handleSearchOrder = () => {
    if (!searchOrderId) return;
    
    setIsSearching(true);
    // Mock search with delay
    setTimeout(() => {
      setSearchResult({
        id: searchOrderId,
        client: 'Sophia Clark',
        service: 'Express Cleaning',
        price: '$125',
        status: 'Completed',
        date: '2026-02-20',
      });
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Create Order</h1>
        <p className="text-muted-foreground mt-1">Create new orders and search existing ones.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Create Order Form */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                placeholder="ORD-####"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="bg-input-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-input-background border-input">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="bg-input-background border-input">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-input-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Add any additional notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-input-background border-input min-h-[100px]"
              />
            </div>

            <Button onClick={handleCreateOrder} className="w-full bg-primary hover:bg-primary/90">
              Create Order
            </Button>
          </CardContent>
        </Card>

        {/* Search Order */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchOrder">Order ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="searchOrder"
                    placeholder="Enter order ID..."
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="bg-input-background border-input"
                  />
                  <Button onClick={handleSearchOrder} className="bg-secondary hover:bg-secondary/90">
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isSearching && (
            <Card className="border-border shadow-sm">
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-center text-muted-foreground mt-4">Searching...</p>
              </CardContent>
            </Card>
          )}

          {!isSearching && searchResult && (
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Order Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium text-foreground">{searchResult.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-medium text-foreground">{searchResult.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium text-foreground">{searchResult.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-foreground">{searchResult.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{searchResult.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                      {searchResult.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isSearching && !searchResult && searchOrderId && (
            <Card className="border-border shadow-sm bg-muted/30">
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try searching for a different order ID</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
