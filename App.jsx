
// App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaHeart, FaFire } from "react-icons/fa";

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [trend, setTrend] = useState(null);

  const handleSearch = async () => {
    if (!keyword) return;
    try {
      const res = await axios.get("http://localhost:5000/api/search?keyword=" + keyword);
      setResults(res.data);

      const trendRes = await axios.get("http://localhost:5000/api/trend?keyword=" + keyword);
      setTrend(trendRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveToWishlist = (item) => {
    if (!wishlist.some((w) => w.title === item.title)) {
      setWishlist([...wishlist, item]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-4 font-sans">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow">🔍 eBay Product Finder</h1>

      <div className="flex justify-center mb-8">
        <input
          className="p-3 w-1/2 max-w-md border border-purple-400 rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          type="text"
          placeholder="Enter product keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-r-lg shadow-md transition-colors"
        >
          <FaSearch className="inline mr-2" /> Search
        </button>
      </div>

      {trend && (
        <div className="text-center text-lg text-purple-800 font-semibold mb-4">
          🔥 Google Trend Score for "{keyword}": {trend.score} <FaFire className="inline text-red-500" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-xl border border-purple-200 hover:shadow-2xl transition duration-300 ease-in-out"
          >
            <h2 className="text-xl font-semibold text-purple-700 mb-2">{item.title}</h2>
            <p className="text-gray-800 mb-1">💵 <strong>Price:</strong> ${item.price}</p>
            <p className="text-gray-800 mb-1">📦 <strong>Sold:</strong> {item.sold}</p>
            <p className="text-gray-800 mb-3">👤 <strong>Seller:</strong> {item.seller}</p>
            <button
              onClick={() => saveToWishlist(item)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm shadow flex items-center"
            >
              <FaHeart className="mr-1" /> Save Product
            </button>
          </div>
        ))}
      </div>

      {wishlist.length > 0 && (
        <div className="mt-10 p-4 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">💖 Wishlist</h2>
          <ul className="space-y-2">
            {wishlist.map((item, i) => (
              <li key={i} className="border-b pb-2">
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
