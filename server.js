
// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword;
  const EBAY_APP_ID = process.env.EBAY_APP_ID || "DUMMY_APP_ID";

  try {
    const response = await axios.get(
      "https://svcs.ebay.com/services/search/FindingService/v1",
      {
        params: {
          "OPERATION-NAME": "findItemsByKeywords",
          "SERVICE-VERSION": "1.0.0",
          "SECURITY-APPNAME": EBAY_APP_ID,
          "RESPONSE-DATA-FORMAT": "JSON",
          "REST-PAYLOAD": true,
          keywords: keyword,
          "paginationInput.entriesPerPage": 10,
        },
      }
    );

    const items = response.data.findItemsByKeywordsResponse[0].searchResult[0].item || [];

    const formattedItems = items.map((item) => ({
      title: item.title[0],
      price: item.sellingStatus[0].currentPrice[0].__value__,
      seller: item.sellerInfo[0].sellerUserName[0],
      sold: item.sellingStatus[0].bidCount?.[0] || 0,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("eBay API error:", error.message);
    res.status(500).json({ error: "Failed to fetch eBay products." });
  }
});

app.get("/api/trend", async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const fakeScore = Math.floor(Math.random() * 100) + 1;
    res.json({ keyword, score: fakeScore });
  } catch (error) {
    console.error("Trend API error:", error.message);
    res.status(500).json({ error: "Failed to fetch trend data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
