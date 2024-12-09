// justin1@bu.edu

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CryptoTable from '../components/CryptoTable';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// interface for crypto data
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

export default function CryptoPage() {
    const [data, setData] = useState<CryptoData[]>([]);
    const [isLoading, setLoading] = useState(true);
 
    // fetch data
    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch('/api/getCryptoData');
                const data = await response.json();
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
                setLoading(false);
            }
        };
        fetchCryptoData();
    }, []);
 
    return (
        <>
            <header style={{
                position: 'absolute',
                top: '20px',
                left: '20px'
            }}>
                <Link 
                    href="/" 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'inherit',
                        textDecoration: 'none'
                    }}
                >
                    <ChevronLeftIcon /> Back
                </Link>
            </header>
            <main style={{
                display: 'flex',
                height: '90vh',
                justifyContent: ' center'
            }}>
            {isLoading ? (
                <p>Loading...</p>
            ) : !data ? (
                <p>Error fetching crypto data</p>
            ) : (
                <CryptoTable cryptoData={data} />
            )}
            </main>
        </>
    );
}