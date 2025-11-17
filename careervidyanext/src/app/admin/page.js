// 'use client'

// import React, { useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const Page= () => {
//   // Sample data for the sales graph
//   const salesData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Sales ($)',
//         data: [12000, 19000, 15000, 22000, 18000, 25000],
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Monthly Sales Overview',
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Sales ($)',
//         },
//       },
//     },
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h1>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
//           <DollarSign className="text-blue-500 mr-3" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Total Revenue</p>
//             <p className="text-2xl font-semibold">$45,231</p>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
//           <ShoppingCart className="text-green-500 mr-3" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Total Student </p>
//             <p className="text-2xl font-semibold">1,234</p>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
//           <Package className="text-purple-500 mr-3" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">course </p>
//             <p className="text-2xl font-semibold">89</p>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
//           <Users className="text-orange-500 mr-3" size={32} />
//           <div>
//             <p className="text-sm text-gray-500">Customers</p>
//             <p className="text-2xl font-semibold">567</p>
//           </div>
//         </div>
//       </div>

//       {/* Sales Graph */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <Line data={salesData} options={chartOptions} />
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="text-gray-500">
//                 <th className="pb-3">Order ID</th>
//                 <th className="pb-3">Customer</th>
//                 <th className="pb-3">Date</th>
//                 <th className="pb-3">Total</th>
//                 <th className="pb-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-t">
//                 <td className="py-3">#12345</td>
//                 <td>John Doe</td>
//                 <td>Aug 10, 2025</td>
//                 <td>$199.99</td>
//                 <td>
//                   <span className="text-green-500">Delivered</span>
//                 </td>
//               </tr>
//               <tr className="border-t">
//                 <td className="py-3">#12346</td>
//                 <td>Jane Smith</td>
//                 <td>Aug 9, 2025</td>
//                 <td>$89.50</td>
//                 <td>
//                   <span className="text-yellow-500">Pending</span>
//                 </td>
//               </tr>
//               <tr className="border-t">
//                 <td className="py-3">#12347</td>
//                 <td>Mike Johnson</td>
//                 <td>Aug 8, 2025</td>
//                 <td>$249.00</td>
//                 <td>
//                   <span className="text-blue-500">Processing</span>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {

  // Sample data for the sales graph
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <DollarSign className="text-blue-500 mr-3" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold">$45,231</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <ShoppingCart className="text-green-500 mr-3" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Student</p>
            <p className="text-2xl font-semibold">1,234</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <Package className="text-purple-500 mr-3" size={32} />
          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="text-2xl font-semibold">89</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <Users className="text-orange-500 mr-3" size={32} />
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-2xl font-semibold">567</p>
          </div>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Line data={salesData} options={chartOptions} />
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3">#12345</td>
                <td>John Doe</td>
                <td>Aug 10, 2025</td>
                <td>$199.99</td>
                <td>
                  <span className="text-green-500">Delivered</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-3">#12346</td>
                <td>Jane Smith</td>
                <td>Aug 9, 2025</td>
                <td>$89.50</td>
                <td>
                  <span className="text-yellow-500">Pending</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-3">#12347</td>
                <td>Mike Johnson</td>
                <td>Aug 8, 2025</td>
                <td>$249.00</td>
                <td>
                  <span className="text-blue-500">Processing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
