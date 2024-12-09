import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin') || 'bitcoin';

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}