import { HermesClient } from "@pythnetwork/hermes-client";
 
// The URL below is a public Hermes instance operated by the Pyth Data Association.
// Hermes is also available from several third-party providers listed here:
// https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes

import { defineEventHandler } from '#imports';

// Solana price feed ID for SOL/USD on Pyth Network (hex format)
const SOL_USD_PRICE_ID = "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";

// Connection to Hermes price service
const priceServiceConnection = new HermesClient(
  "https://hermes.pyth.network/",
  {}
);

export default defineEventHandler(async () => {
  try {
    // Fetch the latest price for SOL/USD from Pyth Network
    const priceUpdateData = (
      await priceServiceConnection.getLatestPriceUpdates(
        [SOL_USD_PRICE_ID],
        { encoding: "base64" }
      )
    ).parsed;

    console.log(priceUpdateData);
    
    if (!priceUpdateData || priceUpdateData.length === 0) {
      return {
        success: false,
        error: 'Failed to fetch SOL price data from Pyth Network'
      };
    }
    
    const solPriceFeed = priceUpdateData[0];
    
    // Format price data with proper scaling (based on exponent)
    // Price values in Pyth are scaled by 10^expo
    const expo = solPriceFeed.price.expo;
    const scalingFactor = Math.pow(10, Math.abs(expo));
    
    // Calculate actual price values
    const currentPrice = Number(solPriceFeed.price.price) / scalingFactor;
    const confidence = Number(solPriceFeed.price.conf) / scalingFactor;
    
    // Include EMA price if available
    const emaPrice = solPriceFeed.ema_price ? 
      Number(solPriceFeed.ema_price.price) / scalingFactor : null;
    const emaConfidence = solPriceFeed.ema_price ? 
      Number(solPriceFeed.ema_price.conf) / scalingFactor : null;
    
    return {
      success: true,
      price: currentPrice,
      confidence: confidence,
      publishTime: new Date(solPriceFeed.price.publish_time * 1000).toISOString(),
      emaPrice: emaPrice,
      emaConfidence: emaConfidence,
      exponent: expo,
      priceId: solPriceFeed.id,
      priceSource: 'Pyth Network'
    };
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return {
      success: false,
      error: 'Failed to fetch SOL price',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});
