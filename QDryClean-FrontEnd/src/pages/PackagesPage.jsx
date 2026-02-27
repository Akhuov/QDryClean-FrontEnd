import { useState } from 'react';
import { Package, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

const packageTypes = ['Small', 'Medium', 'Large', 'Extra Large'];

export default function PackagesPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [packageType, setPackageType] = useState('');
  const [weight, setWeight] = useState('');
  const [comment, setComment] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('idle');

  const handleRegister = () => {
    if (!orderNumber || !packageType || !weight) {
      alert('Please fill in all required fields');
      return;
    }

    setRegistrationStatus('pending');
    
    // Mock registration with delay
    setTimeout(() => {
      setRegistrationStatus('registered');
      setTimeout(() => {
        setRegistrationStatus('idle');
        setOrderNumber('');
        setPackageType('');
        setWeight('');
        setComment('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Package Registration</h1>
        <p className="text-muted-foreground mt-1">Register packages for existing orders.</p>
      </div>

      {/* Centered Card Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-xl">
              <Package className="w-6 h-6" />
              Register New Package
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Number */}
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <div className="relative">
                <Input
                  id="orderNumber"
                  placeholder="ORD-####"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="bg-input-background border-input pl-10"
                  disabled={registrationStatus !== 'idle'}
                />
                <Package className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Package Type */}
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type *</Label>
              <Select 
                value={packageType} 
                onValueChange={setPackageType}
                disabled={registrationStatus !== 'idle'}
              >
                <SelectTrigger className="bg-input-background border-input">
                  <SelectValue placeholder="Select package size" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-input-background border-input"
                  disabled={registrationStatus !== 'idle'}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Add any special handling instructions or notes..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-input-background border-input min-h-[100px]"
                disabled={registrationStatus !== 'idle'}
              />
            </div>

            {/* Status Badge */}
            {registrationStatus !== 'idle' && (
              <div className="flex items-center justify-center py-4">
                {registrationStatus === 'pending' && (
                  <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-warning/10 text-warning border border-warning/20">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-warning"></div>
                    <span className="font-medium">Registering package...</span>
                  </div>
                )}
                {registrationStatus === 'registered' && (
                  <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-success/10 text-success border border-success/20 animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Package registered successfully!</span>
                  </div>
                )}
              </div>
            )}

            {/* Register Button */}
            <Button 
              onClick={handleRegister} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={registrationStatus !== 'idle'}
            >
              {registrationStatus === 'idle' ? 'Register Package' : 'Processing...'}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-border bg-muted/30">
          <CardContent className="py-6">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Registration Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Ensure the order number exists before registering a package</li>
                <li>Select the appropriate package size based on dimensions</li>
                <li>Weight should be measured accurately in kilograms</li>
                <li>Add special handling instructions in the comment field if needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
