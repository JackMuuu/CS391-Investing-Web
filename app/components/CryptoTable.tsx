// justin1@bu.edu
// reference: https://mui.com/material-ui/react-table/#system-EnhancedTable.tsx

'use client'

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';

// props for data
interface CryptoData {
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
  }

// props for table
interface CryptoTableProps {
    cryptoData: CryptoData[];
}

// order type for sorting
type Order = 'asc' | 'desc';

// sorting helper
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// sorting function
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// table component
const CryptoTable: React.FC<CryptoTableProps> = ({ cryptoData }) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof CryptoData>('market_cap_rank');

    const handleRequestSort = (property: keyof CryptoData) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = React.useMemo(
        () => [...cryptoData].sort(getComparator(order, orderBy)),
        [cryptoData, order, orderBy]
    );

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                maxWidth: 800,
                maxHeight: 440,
                margin: 'auto'
            }}
            >
            <Table stickyHeader aria-label="crypto table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'market_cap_rank'}
                                direction={orderBy === 'market_cap_rank' ? order : 'asc'}
                                onClick={() => handleRequestSort('market_cap_rank')}
                            >
                                #
                                {orderBy === 'market_cap_rank' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => handleRequestSort('name')}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'current_price'}
                                direction={orderBy === 'current_price' ? order : 'asc'}
                                onClick={() => handleRequestSort('current_price')}
                            >
                                Price
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'price_change_percentage_24h'}
                                direction={orderBy === 'price_change_percentage_24h' ? order : 'asc'}
                                onClick={() => handleRequestSort('price_change_percentage_24h')}
                            >
                                24h
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'total_volume'}
                                direction={orderBy === 'total_volume' ? order : 'asc'}
                                onClick={() => handleRequestSort('total_volume')}
                            >
                                24h Volume
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((crypto, index) => (
                        <TableRow key={index}>
                            <TableCell>{crypto.market_cap_rank}</TableCell>
                            <TableCell>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px' 
                                }}>
                                    <img 
                                        src={crypto.image} 
                                        alt={crypto.name} 
                                        style={{ 
                                            width: '24px', 
                                            height: '24px' 
                                        }} 
                                    />
                                    {crypto.name}{' '}
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: '0.8em',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {crypto.symbol.toUpperCase()}
                                    </Typography>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                ${crypto.current_price < 0.01 
                                    ? crypto.current_price.toFixed(8) // for very small prices like PEPE
                                    : crypto.current_price < 1 
                                        ? crypto.current_price.toFixed(6) // for small prices
                                        : crypto.current_price.toLocaleString() // for normal prices
                                }
                            </TableCell>
                            <TableCell 
                                align="right"
                                sx={{ color: crypto.price_change_percentage_24h >= 0 ? '#00A83F' : '#FF3A33' }}
                            >
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell align="right">${crypto.total_volume.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CryptoTable;