'use client'

import { useState, useEffect } from 'react';
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
  Tab
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function StockTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch('/api/getStockData')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const renderStockData = (stockList) => (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Change</TableCell>
            <TableCell align="right">Change %</TableCell>
            <TableCell align="right">Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockList?.map((stock) => {
            const isPositive = parseFloat(stock.change_percentage) > 0;
            return (
              <TableRow key={stock.ticker}>
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
                <TableCell align="right">{stock.volume}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '95%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Market Overview
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Top Gainers" />
        <Tab label="Top Losers" />
        <Tab label="Most Active" />
      </Tabs>

      {tabValue === 0 && renderStockData(data?.top_gainers)}
      {tabValue === 1 && renderStockData(data?.top_losers)}
      {tabValue === 2 && renderStockData(data?.most_actively_traded)}
    </Box>
  );
}

export default StockTable;