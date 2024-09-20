import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {useEffect, useState} from 'react';

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MarsLineChart = ({data}) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const time = data.traces[0].time;
        const values = data.traces[0].values; // Assuming there's a `values` array for y-axis

        setChartData({
            labels: time,
            datasets: [
                {
                    label: 'Mars Trace Data',
                    data: values, // y-axis data
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        });
    }, [data]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Mars Trace Data Line Chart',
            },
        },
    };

    return <Line data={chartData} options={options}/>;
};

export default MarsLineChart;
