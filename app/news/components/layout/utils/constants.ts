import { NavItem } from '../types/types';

export const navItems: NavItem[] = [
  {
    label: "Notícias",
    href: "/"
  },
  {
    label: "Guia da Temporada",
    href: "/guia-temporada"
  },
  {
    label: "Artigos",
    href: "/reviews"
  },
  {
    label: "Quizzes e Testes",
    href: "/tops"
  },
  {
    label: "Guias",
    href: "/noticias"
  },
  {
    label: "Entrevistas",
    href: "/vips"
  },
  {
    label: "Mais",
    href: "/contato",
    subLinks: [
      { label: "Videogames", href: "/contato/fale-conosco" },
      { label: "Produtos", href: "/contato/sobre" },
      { label: "Mangás", href: "/contato/sobre" },
      { label: "Filmes", href: "/contato/sobre" },
      { label: "Anime Award", href: "/contato/sobre" },
      { label: "Música", href: "/contato/sobre" }
    ]
  },
  {
    label: "Sobre",
    href: "/contato"
  }
];