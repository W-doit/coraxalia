import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  // Mock data for attendance trends
  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Attendance',
        data: [80, 85, 90, 88, 92, 95, 93, 96, 94, 97],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Mock data for member distribution by voice section
  const voiceSectionData = {
    labels: ['Soprano', 'Alto', 'Tenor', 'Bass'],
    datasets: [
      {
        data: [25, 20, 30, 25],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Choir Statistics</h2>

      {/* Responsive grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px]">
          <h3 className="text-lg font-medium mb-2">Attendance Trends</h3>
          <div className="h-[240px]">
            <Line
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </div>
        </div>

        {/* Voice Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md h-[300px]">
          <h3 className="text-lg font-medium mb-2">Member Distribution</h3>
          <div className="h-[240px]">
            <Pie
              data={voiceSectionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
