export async function GET(request, {params}) {
    const {dataset, filename} = params;
    try {
        const response = await fetch(`https://quak-finder.onrender.com/datasets/${dataset}/${filename}`, {
            mode: "no-cors",
            cache: "no-store",
        });
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error fetching dataset:', error);
        return new Response('Error fetching dataset', {status: 500});
    }
}
