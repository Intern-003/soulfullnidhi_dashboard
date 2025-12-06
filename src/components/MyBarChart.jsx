    // MyBarChart.js
    import React from 'react';
    import { Bar } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

    // Register Chart.js components
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const MyBarChart = ({record}) => {
        const success = record?.success ?? 0;
        const failed = record?.failed ?? 0;
        const pending = record?.pending ?? 0;

  const data = {
    labels: ['Pending', 'Success', 'Failed'],
    datasets: [
      {
        label: 'Transactions Today',
        data: [pending, success, failed],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)', // pending
          'rgba(75, 192, 192, 0.6)', // success
          'rgba(255, 99, 132, 0.6)', // failed
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Today Transaction Status' },
    },
  };
      return <Bar data={data} options={options} />;
    };

    export default MyBarChart;