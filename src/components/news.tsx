import { useEffect, useState } from 'react';
import axios from 'axios';


// This has nothing to do with memocurve it can be deleted xD 

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/news');
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Stock and Currency Market News</h1>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            
            <p></p>
          </li>
        ))}
      </ul>
    </div>
  );
}