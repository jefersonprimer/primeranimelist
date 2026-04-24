// components/TopAnimes.tsx

import { useState, useEffect } from 'react';

interface Anime {
  image_url: string;
  title: string;
  type: string;
  episodes: number | 'N/A';
  score: number;
  members: number;
}

const TopAnimes = () => {
  const [animes, setAnimes] = useState<Anime[]>([]); // Lista de animes com dados detalhados
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopAnimes = async () => {
      try {
        // URL da API Jikan para obter os top animes
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        if (!response.ok) {
          throw new Error(`Failed to fetch top animes (${response.status})`);
        }
        const responseData = await response.json();
        
        // Extraímos os dados relevantes de cada anime
        const topAnimes = responseData.data.map((anime: any) => ({
          image_url: anime.images.jpg.image_url,
          title: anime.title,
          type: anime.type,
          episodes: anime.episodes || 'N/A',
          score: anime.score,
          members: anime.members,
        }));
        setAnimes(topAnimes); // Atualiza o estado com os detalhes dos animes
      } catch (err) {
        setError('Erro ao carregar os melhores animes.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnimes();
  }, []);

  if (loading) return <div>Carregando animes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className=" text-black bg-gray-100 p-4 border border-gray-300">
      <h1>Artigos</h1>
      <h2 className="text-xl font-bold mb-4">Top 10 Animes</h2>
      <ul>
        {animes.map((anime, index) => (
          <li key={index} className="flex items-center mb-6">
            <img src={anime.image_url} alt={anime.title} className="w-20 h-28 object-cover rounded-lg" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{anime.title}</h3>
              <p className="text-sm text-black">{anime.type} | {anime.episodes} eps</p>
              <p className="text-sm text-yellow-500">Score: {anime.score}</p>
              <p className="text-sm text-gray-500">Members: {anime.members.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopAnimes;


