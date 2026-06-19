import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Supplier{
  id: number;
  name:string;
  phone:string;
  email:string;
  address:string;

}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Supplier',
        href: '/suppliers',
    },
];

const emptyForm = {name: '', phone:'',email:'',address:'' };

type FormState = typeof emptyForm & { id?: number};

export default function SupplierIndex(){

  const { suppliers } = usePage<{suppliers:any[]}>().props;
  const supplierList = suppliers ?? [];

  const[open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEdit,setIsEdit] = useState(false);

  const handleOpenAdd = () => {
      setForm(emptyForm);
      setIsEdit(false);
      setOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
      setForm({
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address
      });
      setIsEdit(true);
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
      setForm(emptyForm);
      setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setForm({...form,[e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(isEdit && form.id){
          router.put(`/suppliers/${form.id}`, form,{
              onSuccess: handleClose,
          });
      } else {
          router.post(`/suppliers`, form, {
              onSuccess: handleClose,
          });
      }
  };

  const handleDelete = (id: number) => {
      if(window.confirm('Are you sure you want to delete this supplier?')){
          router.delete(`/suppliers/${id}`);
      }
  };

  return (
  <AppLayout breadcrumbs={breadcrumbs}>
    <Card className='p-6 mt-6'>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-blod">Suppliers</h1><Button onClick={handleOpenAdd}>Add Supplier</Button></div>
      <div className="overflow-x-auto">
      <table className="min-w-full border text-sm rounded-lg">
        <thead className="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">ID</th>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Phone No</th>
            <th className="px-4 py-2 text-left font-semibold">Email</th>
            <th className="px-4 py-2 text-left font-semibold">Address</th>
            <th className="px-4 py-2 text-left font-semibold">Action</th>
          </tr></thead>
        <tbody>
          {supplierList.map((supplier) => (
            <tr key={supplier.id} className="border-b last:border-0 dark:hover:bg-neutral-800">
              <td className='px-4 py-2'>{supplier.id}</td>
              <td className="px-4 py-2">{supplier.name}</td>
              <td className="px-4 py-2">{supplier.phone}</td>
              <td className="px-4 py-2">{supplier.email}</td>
              <td className="px-4 py-2">{supplier.address}</td>
              <td className="px-4 py-2 gap-2">
                <Button size="sm" variant="outline" onClick={()=>handleOpenEdit(supplier)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={()=>handleDelete(supplier.id)}>Delete</Button>
              </td>
            </tr> ))}
        </tbody>
      </table>
      </div>
    </Card>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Update Supplier': 'Add Supplier'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required></Input>
          </div>
           <div>
            <Label htmlFor="phone">Phone No</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required></Input>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} required></Input>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="adress" name="address" value={form.address} onChange={handleChange} required></Input>
          </div>
          <div className='flex justify-end-gap-2'>
            <Button type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="outline"> {isEdit ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </AppLayout>
  );
}






