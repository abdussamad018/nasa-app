import {useEffect, useState} from 'react';
import {useTheme, CircularProgress} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SelectBox from './Elements/SelectBox';
import {Autocomplete, TextField} from "@mui/material";
import LineChart from "@/app/components/lineChart";

export default function NasaApp() {
    const theme = useTheme();

    // State for each selection box
    const [dataset, setDataset] = useState('');
    const [method, setMethod] = useState('');
    const [dataFile, setDataFile] = useState('');
    const [plotData, setPlotData] = useState(null);
    const [datefileOptions, setDatefileOptions] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Function to fetch file names based on selected dataset
    const fetchFileName = async (dataset) => {
        setLoadingFiles(true); // Start loading spinner
        try {
            const response = await fetch(`https://quak-finder.onrender.com/datasets/${dataset}`);
            const data = await response.json();

            if (data.files && Array.isArray(data.files)) {
                const options = data.files.map((item) => item.filename);
                setDatefileOptions(options);
            } else {
                console.error("fetchFileName Error:", typeof data.files);
            }
        } catch (error) {
            console.error('fetchFileName Error:', error);
        } finally {
            setLoadingFiles(false); // Stop loading spinner
        }
    };

    // Function to fetch raw data based on selected dataset and datafile
    const fetchRawData = async (datasets, filenames) => {
        setLoadingData(true); // Start loading spinner
        try {
            const response = await fetch(`/api/datafile/${datasets}/${filenames}`, {
                mode: "no-cors",
                cache: "no-cache",
            });
            const data = await response.json();
            setPlotData(data);
        } catch (error) {
            console.error('Error fetching raw data:', error);
        } finally {
            setLoadingData(false); // Stop loading spinner
        }
    };

    // Trigger file fetching whenever the dataset changes
    useEffect(() => {
        if (dataset) {
            fetchFileName(dataset);
        } else {
            setDatefileOptions([]);
            setDataFile('');
            setPlotData(null);
        }
    }, [dataset]);

    // Trigger raw data fetching when dataset and datafile are selected
    useEffect(() => {
        if (dataFile && dataset) {
            fetchRawData(dataset, dataFile);
        }
    }, [dataFile]);

    // Safely access metadata from plotData, with fallback for missing values
    const metadata = plotData?.metadata || {}; // Use an empty object if metadata is missing
    const plotDataset = metadata?.dataset || 'No dataset'; // Provide a fallback if dataset is missing

    const handleSubmit = async () => {
        if (!dataset || !dataFile || !method) {
            alert('Please make sure all selections are made.');
            return;
        }

        try {
            const response = await fetch('/api/sendData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({dataset, dataFile, method}),
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
                <Stack direction="row" sx={{alignItems: 'center', gap: 2}}>
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

                    {/* Data File Selection with Loading Spinner */}
                    {loadingFiles ? (
                        <CircularProgress/>
                    ) : (
                        <Autocomplete
                            disablePortal
                            options={datefileOptions}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} label="Data File"/>}
                            onChange={(e, newValue) => setDataFile(newValue)}
                        />
                    )}

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
                    />

                    {/* Submit Button */}
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Generate
                    </Button>
                </Stack>

                {/* Loading Spinner for Data Fetch */}
                {loadingData ? (
                    <CircularProgress/>
                ) : (
                    <LineChart plotData={plotData}/>
                )}
            </CardContent>
        </Card>
    );
}
