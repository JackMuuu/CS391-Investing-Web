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

interface StockDataItem {
  ticker: string;
  price: number;
  change_amount: number;
  change_percentage: string;
  volume: number;
}

interface StockDataResponse {
  top_gainers?: StockDataItem[];
  top_losers?: StockDataItem[];
  most_actively_traded?: StockDataItem[];
}

export default function StockTable() {
  const [data, setData] = useState<StockDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  // const renderStockData = (stockList?: StockDataItem[]) => (
  //   <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
  //     <Table stickyHeader>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Symbol</TableCell>
  //           <TableCell align="right">Price</TableCell>
  //           <TableCell align="right">Change</TableCell>
  //           <TableCell align="right">Change %</TableCell>
  //           <TableCell align="right">Volume</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {stockList?.map((stock) => {
  //           const isPositive = parseFloat(stock.change_percentage) > 0;
  //           return (
  //             <TableRow key={stock.ticker}>
  //               <TableCell component="th" scope="row">
  //                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //                   {isPositive ? 
  //                     <TrendingUpIcon color="success" /> : 
  //                     <TrendingDownIcon color="error" />
  //                   }
  //                   {stock.ticker}
  //                 </Box>
  //               </TableCell>
  //               <TableCell align="right">${stock.price}</TableCell>
  //               <TableCell 
  //                 align="right"
  //                 sx={{ color: isPositive ? 'success.main' : 'error.main' }}
  //               >
  //                 {stock.change_amount}
  //               </TableCell>
  //               <TableCell 
  //                 align="right"
  //                 sx={{ color: isPositive ? 'success.main' : 'error.main' }}
  //               >
  //                 {stock.change_percentage}
  //               </TableCell>
  //               <TableCell align="right">{stock.volume.toLocaleString()}</TableCell>
  //             </TableRow>
  //           );
  //         })}
  //       </TableBody>
  //     </Table>
  //   </TableContainer>
  // );

  // return (
  //   <Box sx={{ width: '95%', p: 3 }}>
  //     <Typography variant="h4" gutterBottom>
  //       Stock Market Overview
  //     </Typography>
      
  //     <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
  //       <Tab label="Top Gainers" />
  //       <Tab label="Top Losers" />
  //       <Tab label="Most Active" />
  //     </Tabs>

  //     {tabValue === 0 && renderStockData(data?.top_gainers)}
  //     {tabValue === 1 && renderStockData(data?.top_losers)}
  //     {tabValue === 2 && renderStockData(data?.most_actively_traded)}
  //   </Box>
  // );



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error" variant="h6">Error loading data</Typography>
      </Box>
    );
  }

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
            const isPositive = parseFloat(stock.change_percentage) > 0;
            return (
              <TableRow key={stock.ticker} hover>
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
                <TableCell 
                  align="right"
                  sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                >
                  {stock.change_amount}
                </TableCell>
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

  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: '900px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Stock Market Overview
        </Typography>

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

        {tabValue === 0 && renderStockData(data?.top_gainers)}
        {tabValue === 1 && renderStockData(data?.top_losers)}
        {tabValue === 2 && renderStockData(data?.most_actively_traded)}
      </Paper>
    </Box>
  );




}
