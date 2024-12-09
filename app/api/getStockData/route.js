import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function GET(request) {
  // Using String-deconstruction, extract search parameters from the URL
  const searchParams = new URL(request.url).searchParams;

  // No parameters needed for this endpoint as it gets top gainers/losers
  const res = await fetch(
    `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`
  );

  // If the API request fails, return a 500 Internal Server Error response
  if (res.status !== 200) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  // Parse the JSON data from the API response
  const data = await res.json();

  // Return the parsed data in the response as JSON
  return NextResponse.json(data);
}