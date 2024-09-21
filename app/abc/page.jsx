'use client';

import {useEffect, useState} from 'react';
import Plotly from 'plotly.js-dist';
import LineChart from "@/app/components/lineChart";

export default function LunarDatasetPage() {
    const [plotData, setPlotData] = useState(null);
    const dataset = 'mars';
    const filename = 'XB.ELYSE.02.BHV.2019-05-23HR02_evid0041.mseed';

    useEffect(() => {
        const fetchData = async (datasets, filenames) => {
            try {
                const response = await fetch(`/api/datafile/${datasets}/${filenames}`, {
                    mode: "no-cors",
                    cache: "no-cache",
                });
                const data = await response.json();
                setPlotData(data);
                return {
                    props: {
                        plotData: data,  // Pass the fetched data as props
                    },
                };
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(dataset, filename);
    }, []);


    return (
        <div>
            <h1>Lunar Dataset Visualization</h1>
            <LineChart plotData={plotData}/>
        </div>
    );
}
