export const getCryptoLogo = (symbol: string) => {
  const s = symbol.replace('USDT', '').toUpperCase();
  const map: Record<string, string> = {
    'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025',
    'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
    'SOL': 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=025',
    'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025',
    'ADA': 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=025',
    'XRP': 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=025',
    'LINK': 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=025',
    'DOGE': 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=025',
    'DOT': 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=025',
    'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025',
    'USDT': 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025',
  };
  return map[s] || null;
}
