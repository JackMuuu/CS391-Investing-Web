/*******************************************************************************
* app/components/StockTable.tsx
*
* Description:
*     A React component that displays stock market data in a tabulated format.
* The component shows three different categories of stocks: top gainers, top 
* losers, and most actively traded stocks. Each category is accessible through
* tabs. The table displays stock symbols with trend indicators, current prices,
* price changes, percentage changes, and trading volumes. This component uses
* Material-UI (MUI) and its sx prop for styling, implementing a responsive
* design with loading states and error handling.
*
* Features:
*     - Tab-based navigation between different stock categories
*     - Visual indicators for stock price trends (up/down arrows)
*     - Color-coded price changes (green for gains, red for losses)
*     - Loading spinner during data fetch
*     - Error state handling
*     - Responsive design with proper spacing and layout
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

"use client";

import React, { useState, useEffect, MouseEvent } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Define the structure for individual stock data
interface StockDataItem {
  ticker: string;
  price: number;
  change_amount: number;
  change_percentage: string;
  volume: number;
}
// Define the structure for the API response
interface StockDataResponse {
  top_gainers?: StockDataItem[];
  top_losers?: StockDataItem[];
  most_actively_traded?: StockDataItem[];
}

export default function StockTable() {
  const [data, setData] = useState<StockDataResponse | null>(null); // Stores the stock data
  const [loading, setLoading] = useState<boolean>(true); // Tracks loading state
  const [error, setError] = useState<Error | null>(null); // Stores any error that occurs
  const [tabValue, setTabValue] = useState<number>(0); // Tracks active tab index

  // Fetch stock data when component mounts
  useEffect(() => {
    fetch('/api/getStockData')
      .then((res) => res.json())
      .then((data: StockDataResponse) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Handle tab switching
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Display error message if data fetch fails
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error" variant="h6">Error loading data</Typography>
      </Box>
    );
  }

  // Function to render the stock data table
  const renderStockData = (stockList?: StockDataItem[]) => (
    <TableContainer component={Paper} sx={{ maxHeight: 440, mt: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><strong>Symbol</strong></TableCell>
            <TableCell align="right"><strong>Price</strong></TableCell>
            <TableCell align="right"><strong>Change</strong></TableCell>
            <TableCell align="right"><strong>Change %</strong></TableCell>
            <TableCell align="right"><strong>Volume</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockList?.map((stock) => {
            // Determine if stock change is positive
            const isPositive = parseFloat(stock.change_percentage) > 0;
            return (
              <TableRow key={stock.ticker} hover>
                {/* Stock Symbol with Trending Icon */}                
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isPositive ? 
                      <TrendingUpIcon color="success" /> : 
                      <TrendingDownIcon color="error" />
                    }
                    {stock.ticker}
                  </Box>
                </TableCell>
                <TableCell align="right">${stock.price}</TableCell>
                {/* Change Amount Cell */}
                <TableCell 
                  align="right"
                  sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                >
                  {stock.change_amount}
                </TableCell>
                {/* Change Percentage Cell */}                
                <TableCell 
                  align="right"
                  sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                >
                  {stock.change_percentage}
                </TableCell>
                <TableCell align="right">{stock.volume.toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Main component render
  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: '900px', width: '100%' }}>
        {/* title */}
        <Typography variant="h4" align="center" gutterBottom>
          Stock Market Overview
        </Typography>
        
        {/* Tab Navigation */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
          centered
        >
          <Tab label="Top Gainers" />
          <Tab label="Top Losers" />
          <Tab label="Most Active" />
        </Tabs>

        {/* Render appropriate table based on selected tab */}
        {tabValue === 0 && renderStockData(data?.top_gainers)}
        {tabValue === 1 && renderStockData(data?.top_losers)}
        {tabValue === 2 && renderStockData(data?.most_actively_traded)}
      </Paper>
    </Box>
  );




}
