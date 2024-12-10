/*******************************************************************************
* app/components/MainPage.tsx
*
* Description:
*     The web project's main page component, redirected from app/page.tsx. In this
* page, the bitcoin crypto's main information is shown, such as current price,
* changes in 24h, change rate in 24h, and volumn. The Apple's stock information
* is also shown. There are also two buttons can link to detail tables. This 
* component uses MUI and its sx prop for styling.
*
* Author:
*     Yuanman Mu
*     ymmu@bu.edu
*
* Affiliation:
*     Boston University
*
* Creation Date:
*     December 7, 2024
*
*******************************************************************************/

"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';


// interface of a cryptocurrency data
interface CryptoData {
    name: string;
    image: string;
    price: number;
    change: number;
    change_percentage: number;
    volume: number;
  }
  
// interface of a stock data
  interface StockData {
    stockPrice: string;
    stockChange: string;
    stockChangePercent: string;
    stockVolume: string;
  }

// main page component
// Here, MainPage fetches cryptocurrency and stock data using internal api calls from routes and display the data
// It also has loading states, error states, and display the data in a structured layout
export default function MainPage() {
    const [cryptoData, setCryptoData] = useState<CryptoData | null>(null); // state for cryptocurrency data
    const [stockData, setStockData] = useState<StockData | null>(null); // state for stock data
    const [loading, setLoading] = useState<boolean>(true); // state for loading
    const [error, setError] = useState<string | null>(null); // state for errors

    // fetch cryptocurrency and stock data from routes defined in api folder
    useEffect(() => {
        const fetchData = async () => {
        try {
            // fetch crypto data
            const cryptoRes = await fetch('/api/getCryptoData'); // internal api call
            if (!cryptoRes.ok) throw new Error('Failed to fetch crypto data'); // error handling
            const cryptoList: any[] = await cryptoRes.json(); // parse JSON data from response

            // extract bitcoin data from the fetched list
            const bitcoin = cryptoList.find(
                (coin) => coin.id.toLowerCase() === 'bitcoin'
            );
    
            if (bitcoin) {
                const bitcoinData: CryptoData = {
                name: bitcoin.name,
                image: bitcoin.image,
                price: bitcoin.current_price,
                change: bitcoin.price_change_percentage_24h,
                change_percentage: bitcoin.price_change_percentage_24h,
                volume: bitcoin.total_volume,
                };
                setCryptoData(bitcoinData); // update bitcoin crypto state
            } else {
                throw new Error('bitcoin data not found');
            }

            // fetch stock data
            const stockRes = await fetch('/api/getStockData?symbol=AAPL'); // internal api call
            if (!stockRes.ok) throw new Error('Failed to fetch stock data'); // error handling
            const stockJson = await stockRes.json(); // parse JSON data from response

            // update stock state with data fetched from APIs
            setStockData(stockJson);
            setLoading(false); // end loading state
        } catch (err: any) { // error catching
            setError(err.message || 'Unknown error');
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    // during the time fetching data from API, show a circular progress animation
    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
        </Box>
        );
    }

    // display the error message if error occured during fetching
    if (error || !cryptoData || !stockData) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Typography color="error" variant="h6">{error || 'No data available'}</Typography>
        </Box>
        );
    }

    
    const { name, image, price, change, change_percentage, volume } = cryptoData;
    const { stockPrice, stockChange, stockChangePercent, stockVolume } = stockData;

    // rendered UI
    return (
        // a box wrapper covering the entire content section
        <Box 
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ margin: 4, padding: 4, border: '1px solid #ccc', borderRadius: 2 }}
        >
        <Typography variant="h3" gutterBottom>
            Investing Hub
        </Typography>

        {/* the crypto and stock display area */}
        <Box
            display="flex"
            flexDirection="column"
            gap={4}
            sx={{ width: '100%', maxWidth: '600px' }}
        >

            {/* bitcoin crypto section */}

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                {name} (Crypto)
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <Avatar src={image} alt={name} sx={{ width: 64, height: 64 }} />
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Price:</strong> ${price.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Change (24h):</strong> ${change.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Change % (24h):</strong> {change_percentage.toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Volume (24h):</strong> ${volume.toLocaleString()}</Typography>
                </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
                <Link href="/crypto">
                <Button variant="contained">View Crypto Table</Button>
                </Link>
            </Box>
            </Paper>

            {/* apple stock section */}

            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                APPLE (Stock)
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Price:</strong> ${parseFloat(stockPrice).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1" sx={{ color: parseFloat(stockChange) >= 0 ? 'success.main' : 'error.main' }}>
                    <strong>Change:</strong> ${parseFloat(stockChange).toFixed(2)}
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography 
                    variant="body1" 
                    sx={{ color: parseFloat(stockChangePercent) >= 0 ? 'success.main' : 'error.main' }}
                >
                    <strong>Change %:</strong> {stockChangePercent}
                </Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body1"><strong>Volume:</strong> {parseInt(stockVolume).toLocaleString()}</Typography>
                </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
                <Link href="/stocks">
                <Button variant="contained">View Stock Table</Button>
                </Link>
            </Box>
            </Paper>
        </Box>
        </Box>
    );
    }