

export async function GET(request ) {
    try {
        const response = await fetch('https://quak-finder.onrender.com/datasets/mars/XB.ELYSE.02.BHV.2019-05-23HR02_evid0041.mseed');
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching dataset:', error);
        return new Response('Error fetching dataset', { status: 500 });
    }
}
