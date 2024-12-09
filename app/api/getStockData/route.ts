// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// export async function GET(request) {
//   // Using String-deconstruction, extract search parameters from the URL
//   const searchParams = new URL(request.url).searchParams;

//   // No parameters needed for this endpoint as it gets top gainers/losers
//   const res = await fetch(
//     `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`
//   );

//   // If the API request fails, return a 500 Internal Server Error response
//   if (res.status !== 200) {
//     return NextResponse.json(
//       { error: "Failed to fetch data" },
//       { status: 500 }
//     );
//   }

//   // Parse the JSON data from the API response
//   const data = await res.json();

//   // Return the parsed data in the response as JSON
//   return NextResponse.json(data);
// }

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol');

  let fetchUrl: string;

  if (symbol) {
    // Fetch global quote for apple stock containing main info
    fetchUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  } else {
    // In details page, no parameters are needed since we're fetching top gainers/losers
  fetchUrl = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
  }
  const res = await fetch(fetchUrl);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const data = await res.json();

  if (symbol) {
    // parsing global quote data for apple
    const quote = data["Global Quote"];
    if (!quote) {
      return NextResponse.json(
        { error: "No main page quote data available" },
        { status: 500 }
      );
    }

    const stockData = {
      stockName: quote["01. symbol"] || symbol,
      stockPrice: quote["05. price"],
      stockChange: quote["09. change"],
      stockChangePercent: quote["10. change percent"],
      stockVolume: quote["06. volume"]
    };

    return NextResponse.json(stockData, { status: 200 });
  }

  // If no symbol was provided, return the top gainers/losers data for use in stock details page
  return NextResponse.json(data, { status: 200 });

}