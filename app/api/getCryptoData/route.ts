/*******************************************************************************
* app/api/getCryptoData/route.ts
*
* Description:
*     This is the API route for fetching cryptocurrency data. It fetches detailed
* market data for the top 100 coins by market capitalization. 
* 
* Author:
*     Justin Wang, Yuanman Mu
*     justin1@bu.edu, ymmu@bu.edu
*
* Affiliation:
*     Boston University
*
* Creation Date:
*     December 7, 2024
*
*******************************************************************************/

import { NextResponse } from 'next/server';

// structure of a single cryptocurrency in the market
interface MarketCoinData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
  }

// fetching function
export async function GET(request: Request) {
  try {
    
    // fetch market data for top 100 coins
    const marketRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': process.env.Coin_Gecko_API_KEY || ''
        }
      }
    );

    // check if the response from CoinGecko is successful
    if (!marketRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: marketRes.status }
      );
    }

    // parse JSON from the response
    const marketData: MarketCoinData[] = await marketRes.json();

    return NextResponse.json(marketData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}