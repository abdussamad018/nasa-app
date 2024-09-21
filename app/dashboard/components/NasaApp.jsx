"use client";
import {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SelectBox from './Elements/SelectBox';
import {Autocomplete, TextField} from "@mui/material";
import LineChart from "@/app/components/lineChart"; // Assuming SelectBox is a styled Select component

export default function NasaApp() {
    const theme = useTheme();
    const colorPalette = [
        theme.palette.primary.dark,
        theme.palette.primary.main,
        theme.palette.primary.light,
    ];

    // State for each selection box
    const [dataset, setDataset] = useState('');
    const [method, setMethod] = useState('');
    const [dataFile, setDataFile] = useState([]);
    const [plotData, setPlotData] = useState(null);
    const datefileOption = [];


    // Function to fetch time range options based on selected dataset
    // const fetchTimeRangeOptions = async (dataset) => {
    //     try {
    //         const response = await fetch(`https://quak-finder.onrender.com/datasets/${dataset}/timerange`); // Example API call
    //         const data = await response.json();
    //         console.log(data);
    //         setTimeRangeOptions(data); // Assuming API returns { timeRanges: [...] }
    //     } catch (error) {
    //         console.error('Error fetching time range options:', error);
    //     }
    // };


    const fetchFileName = async (dataset) => {
        try {
            const response = await fetch(`https://quak-finder.onrender.com/datasets/${dataset}`);
            const data = await response.json();

            console.log(data); // Log the response to inspect its structure

            if (data.files && Array.isArray(data.files)) {
                data.files.map((item) => {
                    datefileOption.push(item.filename);
                });
            } else {
                console.error("fetchFileName Error:", typeof data.files);
            }

        } catch (error) {
            console.error('fetchFileName Error:', error);
        }
    }

    const fetchProcessModel = async () => {
        try {
            const response = await fetch(`https://quak-finder.onrender.com/processing-methods`);
            const data = await response.json();
            console.log("Process Model Data show" + data);
            if (data && Array.isArray(data)) {
                data.map((item) => {
                    console.log("Process Model: " + item.bandpass);
                });
            }

        } catch (error) {
            console.error('Process Model Error:', error);
        }
    }


    const fetchRawData = async (datasets, filenames) => {
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


// Trigger the API call whenever the dataset changes
    useEffect(() => {
        if (dataset) {
            // fetchTimeRangeOptions(dataset);
            fetchFileName(dataset)
            //fetchProcessModel();
        } else {
            //setTimeRangeOptions([]); // Reset options if no dataset is selected
            setDataFile([]);
        }
    }, [dataset]);

    useEffect(() => {
        if (dataFile && dataset) {
            fetchRawData(dataset, dataFile);
        } else {
            setDataFile([])
        }
    }, [dataFile, dataset]);

    const handleSubmit = async () => {
        if (!dataset || !timeRange || !method) {
            alert('Please make sure all selections are made.');
            return;
        }


        try {
            const response = await fetch('/api/sendData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({dataset, timeRange, method}),
            });

            if (response.ok) {
                alert('Data sent successfully!');
            } else {
                alert('Error sending data');
            }
        } catch (error) {
            alert('An error occurred while sending the data');
        }
    };

    return (
        <Card variant="outlined" sx={{width: '100%'}}>
            <CardContent>
                <Stack
                    direction="row"
                    sx={{
                        alignContent: {xs: 'center', sm: 'flex-start'},
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Dataset Selection */}
                    <SelectBox
                        label="Select Dataset"
                        value={dataset}
                        onChange={(e) => setDataset(e.target.value)}
                        options={[
                            {value: '', label: 'Select one'},
                            {value: 'lunar', label: 'Lunar'},
                            {value: 'mars', label: 'Mars'},
                        ]}

                    />

                    {/* Time Range Selection */}
                    <Autocomplete
                        disablePortal
                        options={datefileOption}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Data File"/>}
                        onChange={(e) => setDataFile(e.target.value)}
                    />

                    {/* De-noising Method Selection */}
                    <SelectBox
                        label="Select De-noising Method"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        options={[
                            {value: 'Method A', label: 'Method A'},
                            {value: 'Method B', label: 'Method B'},
                            {value: 'Method C', label: 'Method C'},
                        ]}
                        disabled={''}
                    />

                    {/* Submit Button */}
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Generate
                    </Button>
                </Stack>
                <LineChart plotData={plotData}/>
            </CardContent>
        </Card>
    );
}
