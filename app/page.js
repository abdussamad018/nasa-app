"use client";

import Box from '@mui/material/Box';
import NasaApp from "@/app/dashboard/components/NasaApp";
import MarsLineChart from "@/app/components/MarsLineChart";
import {useEffect, useState} from "react";
import LineChart from "@/app/components/lineChart";

export default function Home() {
    const [result, setResult] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://quak-finder.onrender.com/datasets/mars/XB.ELYSE.02.BHV.2019-05-23HR02_evid0041.mseed', {
                    cache: 'no-store',
                    mode: "no-cors"
                });

                if (!response) {
                    console.log('Empty response');
                } else {
                    // Assuming you want to do something with the response
                    // e.g., result.text(), result.json(), etc.
                    const data = await response.text(); // or response.json(), depending on your response format
                    setResult(data);
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, [result]);  // Empty dependency array means it runs only on mount

    return (
        <Box sx={{display: 'flex'}}>
            <NasaApp/>


        </Box>


    )
        ;
}
