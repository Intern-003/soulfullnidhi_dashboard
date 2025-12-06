// MyBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyBarChart = ({ record }) => {
  // Ensure all data points are numbers, fallback to 0
  const todayPayin = Number(record?.today_payin) || 0;
  const todayProfit = Number(record?.PayinProfitAmount_current) || 0;
  const todaySuccess = Number(record?.payinTransactionStatusCounts.success) || 0;
  const todayFailed = Number(record?.payinTransactionStatusCounts.failed) || 0;
  const todayPending = Number(record?.payinTransactionStatusCounts.pending) || 0;

  const data = {
    labels: ['Today Payin', 'Today Profit', 'Success', 'Failed', 'Pending'],
    datasets: [
      {
        label: 'Today Summary',
        data: [todayPayin, todayProfit, todaySuccess, todayFailed, todayPending],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(201, 203, 207, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 2,
        borderRadius: 10,        // Rounded edges for 3D effect
        borderSkipped: false,    // Show border on all sides
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Today Summary' },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MyBarChart;
  