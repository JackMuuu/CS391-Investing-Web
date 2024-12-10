/*******************************************************************************
* app/api/getStockData/route.ts
*
* Description:
*     A Next.js API route handler that fetches stock market data from Alpha 
* Vantage API. The route supports two modes of operation: fetching individual 
* stock data when a symbol parameter is provided, and fetching top gainers/losers 
* data when no parameters are specified. This route is used to provide data for 
* both the main page's stock display and the detailed stock tables.
*
* API Endpoints:
*     - GET /api/getStockData?symbol={symbol} : Returns specific stock data
*     - GET /api/getStockData : Returns top gainers/losers data
*
* Environment Variables:
*     - ALPHA_VANTAGE_API_KEY: API key for accessing Alpha Vantage services
*
* Response Format:
*     For specific symbol:
*         {
*             stockName: string,
*             stockPrice: string,
*             stockChange: string,
*             stockChangePercent: string,
*             stockVolume: string
*         }
*     
*     For top gainers/losers:
*         Returns raw Alpha Vantage API response
*
* Error Handling:
*     - Returns 500 status code for failed API requests
*     - Returns 500 status code when quote data is unavailable
*
* Author:
*     Shuwei Zhu
*     david996@bu.edu
*
* Affiliation:
*     Boston University
*
* Creation Date:
*     December 7, 2024
*
*******************************************************************************/
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