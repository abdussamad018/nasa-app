'use client';  // Client-side rendering is still needed for Plotly

import {useEffect} from 'react';
import Plotly from 'plotly.js-dist';

export default function LineChart({plotData}) {
    console.log(plotData);
    useEffect(() => {
        if (plotData) {
            // Extract metadata and traces from the passed plotData prop
            const {dataset, filename, start_time, end_time, sampling_rate, traces} = plotData.metadata;

            const traceData = plotData.traces.map(trace => ({
                x: trace.time,
                y: trace.amplitude,
                type: 'scatter',
                mode: 'lines',
                name: trace.channel
            }));

            // Render the Plotly chart after plotData is passed in
            Plotly.newPlot('myDiv', traceData, {
                title: `Dataset: ${dataset}, File: ${filename}`,
                xaxis: {
                    title: 'Time (seconds)',
                    range: [0, Math.max(...plotData.traces[0].time)]
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
            });
        }
    }, [plotData]);

    return (
        <div>
            {/* Div for rendering the plot */}
            <div id="myDiv" style={{width: '100%', height: '500px'}}></div>
        </div>
    );
}
