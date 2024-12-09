"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';

interface CryptoData {
    name: string;
    image: string;
    price: number;
    change: number;
    change_percentage: number;
    volume: number;
  }
  
  interface StockData {
    stockPrice: string;
    stockChange: string;
    stockChangePercent: string;
    stockVolume: string;
  }

export default function MainPage() {
    const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            // fetch crypto data
            const cryptoRes = await fetch('/api/getCryptoData?coin=bitcoin');
            if (!cryptoRes.ok) throw new Error('Failed to fetch crypto data');
            const cryptoJson = await cryptoRes.json();

            // fetch stock data
            const stockRes = await fetch('/api/getStockData?symbol=AAPL');
            if (!stockRes.ok) throw new Error('Failed to fetch stock data');
            const stockJson = await stockRes.json();

            setCryptoData(cryptoJson);
            setStockData(stockJson);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    //during the time fetching data from API, show a circular progress animation
    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
        </Box>
        );
    }

    if (error || !cryptoData || !stockData) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Typography color="error" variant="h6">{error || 'No data available'}</Typography>
        </Box>
        );
    }

  const { name, image, price, change, change_percentage, volume } = cryptoData;
  const { stockPrice, stockChange, stockChangePercent, stockVolume } = stockData;

  return (
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

      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        sx={{ width: '100%', maxWidth: '600px' }}
      >

        {/* bitcoin Crypto Section */}

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

        {/* Apple Stock Section */}

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