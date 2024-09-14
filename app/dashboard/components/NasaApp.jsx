import {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SelectBox from './Elements/SelectBox'; // Assuming SelectBox is a styled Select component

export default function NasaApp() {
    const theme = useTheme();
    const colorPalette = [
        theme.palette.primary.dark,
        theme.palette.primary.main,
        theme.palette.primary.light,
    ];

    // State for each selection box
    const [dataset, setDataset] = useState('');
    const [timeRange, setTimeRange] = useState('');
    const [method, setMethod] = useState('');
    const [timeRangeOptions, setTimeRangeOptions] = useState([]);

    // Function to fetch time range options based on selected dataset
    const fetchTimeRangeOptions = async (dataset) => {
        try {
            const response = await fetch(`https://quak-finder.onrender.com/datasets/${dataset}/timerange`); // Example API call
            const data = await response.json();
            console.log(data);
            setTimeRangeOptions(data); // Assuming API returns { timeRanges: [...] }
        } catch (error) {
            console.error('Error fetching time range options:', error);
        }
    };

    // Trigger the API call whenever the dataset changes
    useEffect(() => {
        if (dataset) {
            fetchTimeRangeOptions(dataset);
        } else {
            setTimeRangeOptions([]); // Reset options if no dataset is selected
        }
    }, [dataset]);

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
                            {value: 'lunar', label: 'Lunar'},
                            {value: 'mars', label: 'Mars'},
                        ]}

                    />

                    {/* Time Range Selection */}
                    <SelectBox
                        label="Select Time Range"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        options={timeRangeOptions} // Dynamically fetched options
                        disabled={!dataset || timeRangeOptions.length === 0} // Disable if no dataset or options
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
                        disabled={!timeRange}
                    />

                    {/* Submit Button */}
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Generate
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
