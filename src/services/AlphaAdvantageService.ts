import axios from 'axios';

const API_KEY = '3ZFUIQU9JIH5V83L';

export interface User {
    firstName: string;
    lastName: string;
}

export interface StockQuote {
    '1. symbol': string;
    '2. price': string;
    '3. volume': string;
    '4. timestamp': string;
}

export interface MetaData {
    '1. Information': string;
    '2. Notes': string;
    '3. Time Zone': string;
}

export interface StockQuoteResponse {
    'Meta Data': MetaData;
    'Stock Quotes': StockQuote[];
}

export default class AlphaAdvantageService {

    public static async stockQuote(symbols: string[]): Promise<StockQuoteResponse> {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'BATCH_STOCK_QUOTES',
                symbols: symbols.join(','),
                apikey: API_KEY
            }
        });
        return response.data;
    }

}