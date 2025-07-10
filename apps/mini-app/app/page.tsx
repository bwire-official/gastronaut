"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

// Simple GasInfoRow component for display
function GasInfoRow({ chainName, gweiPrice, priceColor }: { chainName: string; gweiPrice: number; priceColor: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #eee" }}>
      <span>{chainName}</span>
      <span style={{ color: priceColor, fontWeight: 600 }}>{gweiPrice} Gwei</span>
    </div>
  );
}

export default function Home() {
  const [gasData, setGasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/gas/now")
      .then((res) => res.json())
      .then((data) => {
        setGasData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper to get chain name and color (customize as needed)
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return "Ethereum";
      case 56: return "BNB Chain";
      case 137: return "Polygon";
      case 42161: return "Arbitrum";
      case 10: return "Optimism";
      case 43114: return "Avalanche";
      case 101: return "Solana";
      case 0: return "Bitcoin";
      default: return `Chain ${chainId}`;
    }
  };
  const getColor = (gwei: number) => gwei < 20 ? "green" : gwei < 50 ? "orange" : "red";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Live Gas Prices</h2>
        {loading ? (
          <div>Loading live data...</div>
        ) : (
          <div>
            {gasData.map((item) => (
              <GasInfoRow
                key={item.chain_id}
                chainName={getChainName(item.chain_id)}
                gweiPrice={item.price_average}
                priceColor={getColor(item.price_average)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
