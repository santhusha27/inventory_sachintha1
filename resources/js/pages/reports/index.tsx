import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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
    grn_number: string;
    total_amount: number;
    purchase_date: string;
}

interface Stock {
    id: number;
    quantity: number;
    reorder_level: number;
    product: {
        name: string;
    };
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
    const today = new Date().toISOString().split('T')[0];

    const currentYear = new Date().getFullYear();
    const [customSales, setCustomSales] = useState<Sale[]>([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const dailySales = sales.filter((sale) => {
        const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];

        return saleDate === today;
    });

    const annualSales = sales.filter(
        (sale) => new Date(sale.sale_date).getFullYear() === currentYear,
    );

    const dailySalesChart = dailySales.map((item) => ({
        name: `Sale ${item.id}`,
        value: Number(item.total_amount),
    }));

    const annualSalesChart = annualSales.map((item) => ({
        name: `Sale ${item.id}`,
        value: Number(item.total_amount),
    }));

    const purchaseChart = purchases.map((item) => ({
        name: `${item.grn_number}`,
        value: Number(item.total_amount),
    }));

    const stockChart = stocks.map((item) => ({
        name: item.product.name,
        value: Number(item.quantity),
    }));

    const customSalesChart = customSales.map((item) => ({
        name: item.sale_date,

        value: Number(item.total_amount),
    }));

    const lowStock = stocks.filter(
        (item) => item.quantity <= item.reorder_level,
    );

    const lowStockChart = lowStock.map((item) => ({
        name: item.product.name,
        value: item.quantity,
    }));

    const generateCustomReport = () => {
        if (!fromDate || !toDate) {
            alert('Please select both dates');
            return;
        }

        const filtered = sales.filter((sale) => {
            return sale.sale_date >= fromDate && sale.sale_date <= toDate;
        });

        setCustomSales(filtered);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <Card className="mt-6 p-6">
                <h1 className="mb-6 text-2xl font-bold">Reports</h1>

                <div className="mb-6 flex flex-wrap gap-3">
                    <Button
                        variant={report === 'daily' ? 'default' : 'outline'}
                        onClick={() => setReport('daily')}
                    >
                        Daily Sales
                    </Button>

                    <Button
                        variant={report === 'annual' ? 'default' : 'outline'}
                        onClick={() => setReport('annual')}
                    >
                        Annual Sales
                    </Button>

                    <Button
                        variant={report === 'custom' ? 'default' : 'outline'}
                        onClick={() => setReport('custom')}
                    >
                        Custom Sales
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
                {/* DAILY SALES */}

                {report === 'daily' && (
                    <ReportSection
                        title="Daily Sales Report"
                        chartData={dailySalesChart}
                        chartType="pie"
                    >
                        <tr>
                            <th className="px-4 py-2 text-left">Invoice No</th>

                            <th className="px-4 py-2 text-left">Date</th>

                            <th className="px-4 py-2 text-left">
                                Total Amount
                            </th>
                        </tr>

                        {dailySales.map((item) => (
                            <tr key={item.id} className="border-b bg-orange-50">
                                <td className="px-4 py-2">{item.id}</td>

                                <td className="px-4 py-2">{item.sale_date}</td>

                                <td className="px-4 py-2">
                                    Rs. {item.total_amount}
                                </td>
                            </tr>
                        ))}
                    </ReportSection>
                )}

                {/* ANNUAL SALES */}

                {report === 'annual' && (
                    <ReportSection
                        title="Annual Sales Report"
                        chartData={annualSalesChart}
                        chartType="bar"
                    >
                        <tr>
                            <th className="px-4 py-2 text-left">Invoice No</th>

                            <th className="px-4 py-2 text-left">Date</th>

                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>

                        {annualSales.map((item) => (
                            <tr key={item.id} className="border-b bg-orange-50">
                                <td className="px-4 py-2">{item.id}</td>

                                <td className="px-4 py-2">{item.sale_date}</td>

                                <td className="px-4 py-2">
                                    Rs. {item.total_amount}
                                </td>
                            </tr>
                        ))}
                    </ReportSection>
                )}

                {/* CUSTOM SALES */}

                {report === 'custom' && (
                    <div className="space-y-5">
                        <div>
                            <Label>From Date</Label>

                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>To Date</Label>

                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        <Button onClick={generateCustomReport}>
                            Generate Report
                        </Button>

                        <ReportSection
                            title="Custom Sales Report"
                            chartData={customSalesChart}
                            chartType="pie"
                        >
                            <tr>
                                <th className="px-4 py-2 text-left">
                                    Invoice No
                                </th>

                                <th className="px-4 py-2 text-left">Date</th>

                                <th className="px-4 py-2 text-left">Amount</th>
                            </tr>

                            {customSales.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b bg-orange-50"
                                >
                                    <td className="px-4 py-2">{item.id}</td>

                                    <td className="px-4 py-2">
                                        {item.sale_date}
                                    </td>

                                    <td className="px-4 py-2">
                                        Rs. {item.total_amount}
                                    </td>
                                </tr>
                            ))}
                        </ReportSection>
                    </div>
                )}

                {/* PURCHASE REPORT */}

                {report === 'purchase' && (
                    <ReportSection
                        title="Purchase Report"
                        chartData={purchaseChart}
                        chartType="bar"
                    >
                        <tr>
                            <th className="px-4 py-2 text-left">GRN No</th>

                            <th className="px-4 py-2 text-left">Date</th>

                            <th className="px-4 py-2 text-left">Amount</th>
                        </tr>

                        {purchases.map((item) => (
                            <tr
                                key={item.grn_number}
                                className="border-b bg-orange-50"
                            >
                                <td className="px-4 py-2">{item.grn_number}</td>

                                <td className="px-4 py-2">
                                    {item.purchase_date}
                                </td>

                                <td className="px-4 py-2">
                                    Rs. {item.total_amount}
                                </td>
                            </tr>
                        ))}
                    </ReportSection>
                )}

                {/* STOCK REPORT */}

                {report === 'stock' && (
                    <ReportSection
                        title="Stock Report"
                        chartData={stockChart}
                        chartType="bar"
                    >
                        <tr>
                            <th className="px-4 py-2 text-left">Product</th>

                            <th className="px-4 py-2 text-left">Quantity</th>
                        </tr>

                        {stocks.map((item) => (
                            <tr key={item.id} className="border-b bg-orange-50">
                                <td className="px-4 py-2">
                                    {item.product.name}
                                </td>

                                <td className="px-4 py-2">{item.quantity}</td>
                            </tr>
                        ))}
                    </ReportSection>
                )}

                {/* LOW STOCK REPORT */}

                {report === 'low' && (
                    <ReportSection
                        title="Low Stock Report"
                        chartData={lowStockChart}
                        chartType="pie"
                    >
                        <tr>
                            <th className="px-4 py-2 text-left">Product</th>

                            <th className="px-4 py-2 text-left">
                                Current Stock
                            </th>

                            <th className="px-4 py-2 text-left">
                                Reorder Level
                            </th>
                        </tr>

                        {lowStock.map((item) => (
                            <tr key={item.id} className="border-b bg-orange-50">
                                <td className="px-4 py-2">
                                    {item.product.name}
                                </td>

                                <td className="px-4 py-2 text-red-600">
                                    {item.quantity}
                                </td>

                                <td className="px-4 py-2">
                                    {item.reorder_level}
                                </td>
                            </tr>
                        ))}
                    </ReportSection>
                )}
            </Card>
        </AppLayout>
    );
}

function ReportSection({
    title,
    chartData,
    children,
    chartType = 'pie',
}: {
    title: string;
    chartData: any[];
    children: React.ReactNode;
    chartType?: 'pie' | 'bar';
}) {
    return (
        <div className="space-y-6">
            <Card className="bg-orange-50 p-6">
                <h2 className="mb-4 text-xl font-bold">{title} Graph</h2>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                        {chartType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar dataKey="value" fill="#f97316" />
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                    fill="#f97316"
                                />

                                <Tooltip />

                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="mb-4 text-xl font-bold">{title} Table</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-orange-100">{children}</thead>
                    </table>
                </div>
            </Card>
        </div>
    );
}
