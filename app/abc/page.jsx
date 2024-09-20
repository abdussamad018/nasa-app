'use client';

import {useEffect, useState} from 'react';
import Plotly from 'plotly.js-dist';

export default function LunarDatasetPage() {
    const [plotData, setPlotData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/datafile');
                const data = await response.json();
                console.log(data);

                // Extract metadata and traces
                const {dataset, filename, start_time, end_time, sampling_rate} = data.metadata;

                const traces = data.traces.map(trace => ({
                    x: trace.time,
                    y: trace.amplitude,
                    type: 'scatter',
                    mode: 'lines',
                    name: trace.channel
                }));

                // Set up the plot data for rendering
                setPlotData({
                    traces,
                    layout: {
                        title: `Dataset: ${dataset}, File: ${filename}`,
                        xaxis: {
                            title: 'Time (seconds)',
                            range: [0, Math.max(...data.traces[0].time)]
                        },
                        yaxis: {title: 'Amplitude'},
                        annotations: [
                            {
                                xref: 'paper',
                                yref: 'paper',
                                x: 0,
                                xanchor: 'left',
                                y: 1,
                                yanchor: 'bottom',
                                text: `Start: ${start_time}<br>End: ${end_time}<br>Sampling Rate: ${sampling_rate} Hz`,
                                showarrow: false,
                            },
                        ],
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (plotData) {
            // Render the Plotly chart
            Plotly.newPlot('myDiv', plotData.traces, plotData.layout);
        }
    }, [plotData]);

    return (
        <div>
            <h1>Lunar Dataset Visualization</h1>
            {/* Div for rendering the plot */}
            <div id="myDiv" style={{width: '100%', height: '500px'}}></div>
        </div>
    );
}
