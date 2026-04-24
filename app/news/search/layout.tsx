import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - Crunchyroll Notícias'
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 

