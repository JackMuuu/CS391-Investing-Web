import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin');

    // if specific coin is specified in params, fetch market data for that coin
    if (coin) {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch data for ${coin}` },
          { status: res.status }
        );
      }

      const coinJson = await res.json();
      const responseData = {
        name: coinJson.name,
        image: coinJson.image?.large,
        price: coinJson.market_data?.current_price?.usd,
        change: coinJson.market_data?.price_change_24h,
        change_percentage: coinJson.market_data?.price_change_percentage_24h,
        volume: coinJson.market_data?.total_volume?.usd,
      };

      return NextResponse.json(responseData, { status: 200 });
    }
    
    // if no specific coin is specified in params, fetch market data for top 100 coins
    const marketRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': process.env.Coin_Gecko_API_KEY || ''
        }
      }
    );

    if (!marketRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: marketRes.status }
      );
    }

    const marketData = await marketRes.json();
    const formattedMarketData = marketData.map((coin: any) => ({
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      total_volume: coin.total_volume,
      price_change_percentage_24h: coin.price_change_percentage_24h
    }));

    return NextResponse.json(formattedMarketData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}