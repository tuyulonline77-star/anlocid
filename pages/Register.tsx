import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMember } from '../services/mockDb';
import { Input, Label, Select, Button, Textarea, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { SHIRT_SIZES } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    nickname: '',
    birthPlace: '',
    birthDate: '',
    address: '',
    phone: '',
    carType: '',
    carYear: '',
    carColor: '',
    plateNumber: '',
    shirtSize: 'M',
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // @ts-ignore
      await createMember(formData);
      alert('Application submitted successfully!');
      navigate('/');
    } catch (error) {
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex justify-center items-center bg-slate-50">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-slate-900 text-white rounded-t-xl py-8">
          <CardTitle className="text-center text-3xl">Join the Club</CardTitle>
          <p className="text-center text-slate-400 mt-2">Become a member of the elite automotive community</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname *</Label>
                  <Input id="nickname" name="nickname" required value={formData.nickname} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Place of Birth</Label>
                  <Input id="birthPlace" name="birthPlace" value={formData.birthPlace} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" name="address" required value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carType">Car Make & Model *</Label>
                  <Input id="carType" name="carType" placeholder="e.g. BMW M3" required value={formData.carType} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carYear">Year</Label>
                  <Input id="carYear" name="carYear" placeholder="e.g. 2023" value={formData.carYear} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carColor">Color</Label>
                  <Input id="carColor" name="carColor" value={formData.carColor} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number *</Label>
                  <Input id="plateNumber" name="plateNumber" required value={formData.plateNumber} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Membership Details</h3>
              <div className="space-y-2">
                <Label htmlFor="shirtSize">Shirt Size *</Label>
                <Select id="shirtSize" name="shirtSize" value={formData.shirtSize} onChange={handleChange}>
                  {SHIRT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Why do you want to join? *</Label>
                <Textarea id="reason" name="reason" required value={formData.reason} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}