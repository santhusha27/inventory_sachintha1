import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
];


interface Sale {
    id: number;
    total_amount: number;
    sale_date: string;
}


interface Purchase {
    id: number;
    total_amount: number;
    purchase_date: string;
}


interface Stock {
    id: number;
    product: {
        name: string;
    };
    quantity: number;
    reorder_level: number;
}



export default function ReportsIndex() {

    const {
        sales = [],
        purchases = [],
        stocks = [],
    } = usePage<{
        sales: Sale[];
        purchases: Purchase[];
        stocks: Stock[];
    }>().props;


    const [report, setReport] = useState('daily');


    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');



    const generateCustomReport = () => {

        router.get('/reports/custom', {
            from: fromDate,
            to: toDate,
        });

    };



    return (

        <AppLayout breadcrumbs={breadcrumbs}>

            <Card className="mt-6 p-6">


                <div className="mb-6">

                    <h1 className="font-bold text-2xl">
                        Reports 
                    </h1>

                </div>



                {/* Report Buttons */}

                <div className="mb-6 flex flex-wrap gap-3">


                    <Button
                        variant={report === 'daily' ? 'default' : 'outline'}
                        onClick={() => setReport('daily')}
                    >
                        Daily Sales Report
                    </Button>



                    <Button
                        variant={report === 'annual' ? 'default' : 'outline'}
                        onClick={() => setReport('annual')}
                    >
                        Annual Sales Report
                    </Button>



                    <Button
                        variant={report === 'custom' ? 'default' : 'outline'}
                        onClick={() => setReport('custom')}
                    >
                        Custom Date Sales Report
                    </Button>



                    <Button
                        variant={report === 'purchase' ? 'default' : 'outline'}
                        onClick={() => setReport('purchase')}
                    >
                        Purchase Report
                    </Button>



                    <Button
                        variant={report === 'stock' ? 'default' : 'outline'}
                        onClick={() => setReport('stock')}
                    >
                        Stock Report
                    </Button>



                    <Button
                        variant={report === 'low' ? 'default' : 'outline'}
                        onClick={() => setReport('low')}
                    >
                        Low Stock Report
                    </Button>


                </div>





                {/* Daily Sales */}

                {report === 'daily' && (

                <ReportTable title="Daily Sales Report">
                         
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold">ID</th>
                            <th className="px-4 py-2 text-left font-semibold">Date</th>
                            <th className="px-4 py-2 text-left font-semibold">Total Amount</th>
                        </tr>
                    
                        {sales.map((sale)=>(

                            <tr className="border-b bg-orange-100 last:border-0 dark:hover:bg-neutral-800" key={sale.id}>

                                <td className="px-4 py-2">{sale.id}</td>
                                <td className="px-4 py-2">{sale.sale_date}</td>
                                <td className="px-4 py-2">Rs. {sale.total_amount}</td>

                            </tr>

                        ))}


                    </ReportTable>

                )}






                {/* Annual Sales */}

                {report === 'annual' && (

                    <ReportTable title="Annual Sales Report">

                        <tr>
                            <th className="px-4 py-2 text-left font-semibold">ID</th>
                            <th className="px-4 py-2 text-left font-semibold">Date</th>
                            <th className="px-4 py-2 text-left font-semibold">Total</th>
                        </tr>


                        {sales.map((sale)=>(

                            <tr className="border-b bg-orange-100 last:border-0 dark:hover:bg-neutral-800" key={sale.id}>

                                <td className="px-4 py-2">{sale.id}</td>
                                <td className="px-4 py-2">{sale.sale_date}</td>
                                <td className="px-4 py-2">Rs. {sale.total_amount}</td>

                            </tr>

                        ))}

                    </ReportTable>

                )}







                {/* Custom Date Report */}

                {report === 'custom' && (

                    <div className="space-y-4">


                        <div>

                            <Label>
                                From Date
                            </Label>

                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e)=>setFromDate(e.target.value)}
                                className="bg-orange-100"
                            />

                        </div>



                        <div>

                            <Label>
                                To Date
                            </Label>

                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e)=>setToDate(e.target.value)}
                                className="bg-orange-100"
                            />

                        </div>



                        <Button onClick={generateCustomReport}>
                            Generate Report
                        </Button>


                    </div>

                )}







                {/* Purchase Report */}

                {report === 'purchase' && (

                    <ReportTable title="Purchase Report">


                        <tr>
                            <th className="px-4 py-2 text-left font-semibold" >ID</th>
                            <th className="px-4 py-2 text-left font-semibold" >Date</th>
                            <th className="px-4 py-2 text-left font-semibold" >Total Amount</th>
                        </tr>



                        {purchases.map((purchase)=>(

                            <tr className="border-b bg-orange-100 last:border-0 dark:hover:bg-neutral-800" key={purchase.id}>

                                <td className="px-4 py-2">
                                    {purchase.id}
                                </td>


                                <td className="px-4 py-2">
                                    {purchase.purchase_date}
                                </td>


                                <td className="px-4 py-2">
                                    Rs. {purchase.total_amount}
                                </td>


                            </tr>

                        ))}


                    </ReportTable>

                )}







                {/* Stock Report */}

                {report === 'stock' && (

                    <ReportTable title="Stock Report">


                        <tr>
                            <th className="px-4 py-2 text-left font-semibold" >Product</th>
                            <th className="px-4 py-2 text-left font-semibold" >Quantity</th>
                        </tr>


                        {stocks.map((stock)=>(

                            <tr className="border-b bg-orange-100 last:border-0 dark:hover:bg-neutral-800" key={stock.id}>

                                <td className="px-4 py-2">
                                    {stock.product.name}
                                </td>

                                <td className="px-4 py-2">
                                    {stock.quantity}
                                </td>


                            </tr>

                        ))}


                    </ReportTable>

                )}







                {/* Low Stock Report */}

                {report === 'low' && (

                    <ReportTable title="Low Stock Report">


                        <tr>
                            <th className="px-4 py-2 text-left font-semibold" >Product</th>
                            <th className="px-4 py-2 text-left font-semibold" >Current Stock</th>
                            <th className="px-4 py-2 text-left font-semibold" >Reorder Level</th>
                        </tr>



                        {stocks
                        .filter(
                            stock =>
                            stock.quantity <= stock.reorder_level
                        )
                        .map((stock)=>(


                            <tr className="border-b bg-orange-100 last:border-0 dark:hover:bg-neutral-800" key={stock.id}>


                                <td className="px-4 py-2">
                                    {stock.product.name}
                                </td>


                                <td className="text-red-600 px-4 py-2">
                                    {stock.quantity}
                                </td>


                                <td className="px-4 py-2" >
                                    {stock.reorder_level}
                                </td>


                            </tr>


                        ))}


                    </ReportTable>

                )}



            </Card>


        </AppLayout>

    );
}






function ReportTable({
    title,
    children
}:{
    title:string;
    children:React.ReactNode;
}){


    return (

        <div>

            <h2 className="mb-4 font-semibold text-xl">
                {title}
            </h2>


            <div className="overflow-x-auto">

                <table className="min-w-full rounded-lg border text-sm">


                    <thead className="bg-orange-100 dark:bg-neutral-800">

                        {children}


                    </thead>


                </table>


            </div>


        </div>

    );

}