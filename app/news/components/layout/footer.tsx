'use client';

import React from 'react';
import { useTheme } from "../../context/ThemeContext"; // Importando o hook useTheme

const Footer = () => {
  const { isDark } = useTheme(); // Pegando o estado do tema

  return (
    <footer className={`w-full ${isDark ? "bg-gradient-to-b from-black to-[#1C3039]" : "bg-[#FFFCF6]"}`}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
          {/* Navegação */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-[#000028]"} ${isDark ? "" : "border-t-2 border-[#DADADA]"}`}>Navegação</h4>
            <ul className={`space-y-2 ${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"}`}>
              <li><a href="https://www.crunchyroll.com/pt-br/videos/popular" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Séries Populares</a></li>
              <li><a href="https://www.crunchyroll.com/pt-br/simulcasts" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Séries em Simulcast</a></li>
              <li><a href="https://www.crunchyroll.com/pt-br/simulcastcalendar" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Calendário de Lançamentos</a></li>
              <li><a href="/news" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Notícias</a></li>
              <li><a href="https://store.crunchyroll.com/" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Loja</a></li>
              <li><a href="https://www.crunchyroll.com/games/index.html" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Jogos</a></li>
            </ul>
          </div>

          {/* Contate-nos */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-[#000028]"} ${isDark ? "" : "border-t-2 border-[#DADADA]"}`}>Contate-nos</h4>
            <ul className={`space-y-2 ${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"}`}>
              <li>
                <a href="https://www.youtube.com/c/CrunchyrollBR" target="_blank" className="flex items-center ">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-labelledby="youtube-svg" role="img">
                    <title id="youtube-svg">YouTube</title>
                    <path fill="currentColor" d="M15.666,4.124A2.01,2.01,0,0,0,14.251,2.7,47.511,47.511,0,0,0,8,2.364,47.511,47.511,0,0,0,1.749,2.7,2.01,2.01,0,0,0,.334,4.124,21.09,21.09,0,0,0,0,8a21.09,21.09,0,0,0,.334,3.876A2.01,2.01,0,0,0,1.749,13.3,47.509,47.509,0,0,0,8,13.636a47.509,47.509,0,0,0,6.251-.337,2.01,2.01,0,0,0,1.415-1.424A21.09,21.09,0,0,0,16,8,21.09,21.09,0,0,0,15.666,4.124Zm-9.3,6.255V5.621L10.545,8Z"></path>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF]" : "hover:text-[#000000]"}  hover:underline`}>Youtube</div>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/Crunchyroll.pt/" target="_blank" className="flex items-center">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-labelledby="facebook-svg" role="img">
                    <title id="facebook-svg">Facebook</title>
                    <path fill="currentColor" d="M15.1169,0 L0.8829,0 C0.3949,0 -0.0001,0.395 -0.0001,0.883 L-0.0001,15.117 C-0.0001,15.605 0.3949,16 0.8829,16 L8.5459,16 L8.5459,9.804 L6.4609,9.804 L6.4609,7.389 L8.5459,7.389 L8.5459,5.608 C8.5459,3.542 9.8079,2.417 11.6519,2.417 C12.5349,2.417 13.2939,2.482 13.5149,2.512 L13.5149,4.671 L12.2369,4.672 C11.2339,4.672 11.0399,5.148 11.0399,5.848 L11.0399,7.389 L13.4309,7.389 L13.1199,9.804 L11.0399,9.804 L11.0399,16 L15.1169,16 C15.6049,16 15.9999,15.605 15.9999,15.117 L15.9999,0.883 C15.9999,0.395 15.6049,0 15.1169,0"></path>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF]" : "hover:text-[#000000]"}  hover:underline`}>Facebook</div>
                </a>
              </li>
              <li>
                <a href="https://x.com/crunchyroll_pt" target="_blank" className="flex items-center">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-labelledby="x-svg" role="img">
                    <title id="x-svg">X</title>
                    <path fill="currentColor" d="M13.7124 10.6179L20.4133 3H18.8254L13.0071 9.61448L8.35992 3H3L10.0274 13.0023L3 20.9908H4.58799L10.7324 14.0056L15.6401 20.9908H21L13.7121 10.6179H13.7124ZM11.5375 13.0904L10.8255 12.0944L5.16017 4.16911H7.59922L12.1712 10.5651L12.8832 11.5611L18.8262 19.8748H16.3871L11.5375 13.0908V13.0904Z"></path>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF]" : "hover:text-[#000000]"}  hover:underline`}>X</div>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/Crunchyroll_PT/" target="_blank" className="flex items-center">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-labelledby="instagram-svg" role="img">
                    <title id="instagram-svg">Instagram</title>
                    <path fill="currentColor" d="M8,1.44c2.14,0,2.39,0,3.23,0a4.43,4.43,0,0,1,1.49.28,2.48,2.48,0,0,1,.92.6,2.48,2.48,0,0,1,.6.92,4.43,4.43,0,0,1,.28,1.49c0,0.84,0,1.1,0,3.23s0,2.39,0,3.23a4.43,4.43,0,0,1-.28,1.49,2.65,2.65,0,0,1-1.52,1.52,4.43,4.43,0,0,1-1.49.28c-0.84,0-1.1,0-3.23,0s-2.39,0-3.23,0a4.43,4.43,0,0,1-1.49-.28,2.48,2.48,0,0,1-.92-0.6,2.48,2.48,0,0,1-.6-0.92,4.43,4.43,0,0,1-.28-1.49c0-.84,0-1.1,0-3.23s0-2.39,0-3.23a4.43,4.43,0,0,1,.28-1.49,2.48,2.48,0,0,1,.6-0.92,2.48,2.48,0,0,1,.92-0.6,4.43,4.43,0,0,1,1.49-.28c0.84,0,1.1,0,3.23,0M8,0C5.83,0,5.55,0,4.7,0A5.87,5.87,0,0,0,2.76.42a3.92,3.92,0,0,0-1.42.92A3.92,3.92,0,0,0,.42,2.76A5.87,5.87,0,0,0,0,4.7C0,5.55,0,5.83,0,8s0,2.45,0,3.3a5.87,5.87,0,0,0,.37,1.94,3.92,3.92,0,0,0,.92,1.42,3.92,3.92,0,0,0,1.42.92A5.87,5.87,0,0,0,4.7,16c0.85,0,1.13,0,3.3,0s2.45,0,3.3,0a5.87,5.87,0,0,0,1.94-.37,4.09,4.09,0,0,0,2.34-2.34A5.87,5.87,0,0,0,16,11.3c0-.85,0-1.13,0-3.3s0-2.45,0-3.3a5.87,5.87,0,0,0-.37-1.94,3.92,3.92,0,0,0-.92-1.42A3.92,3.92,0,0,0,13.24.42A5.87,5.87,0,0,0,11.3,0C10.45,0,10.17,0,8,0H8Z"></path>
                    <path fill="currentColor" d="M8,3.89A4.11,4.11,0,1,0,12.11,8,4.11,4.11,0,0,0,8,3.89Zm0,6.77A2.67,2.67,0,1,1,10.67,8,2.67,2.67,0,0,1,8,10.67Z"></path>
                    <circle fill="currentColor" cx="12.27" cy="3.73" r="0.96"></circle>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF]" : "hover:text-[#000000]"}  hover:underline`}>Instagram</div>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@crunchyroll_pt" target="_blank" className="flex items-center">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-labelledby="tiktok-svg" role="img">
                    <title id="tiktok-svg">TikTok</title>
                    <path fill="currentColor" d="M14.095 0H1.905C.855 0 0 .854 0 1.905v12.19C0 15.145.854 16 1.905 16h12.19c1.05 0 1.905-.854 1.905-1.905V1.905C16 .855 15.146 0 14.095 0m-1.521 6.98a2.854 2.854 0 0 1-2.651-1.277v4.395A3.248 3.248 0 1 1 6.674 6.85c.068 0 .134.006.201.01v1.6c-.067-.007-.132-.02-.2-.02a1.658 1.658 0 0 0 0 3.316c.915 0 1.724-.721 1.724-1.637l.016-7.465h1.531a2.853 2.853 0 0 0 2.63 2.547v1.78"></path>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF]" : "hover:text-[#000000]"}  hover:underline`}>TikTok</div>
                </a>
              </li>
            </ul>
          </div>

          {/* Crunchyroll */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-[#000028]"} ${isDark ? "" : "border-t-2 border-[#DADADA]"}`}>Crunchyroll</h4>
            <ul className={`space-y-2 ${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"}`}>
              <li>
                <a href="https://www.crunchyroll.com/pt-br/premium?referrer=newweb_organic_footer_news&return_url=https%3A%2F%2Fwww.crunchyroll.com%2Fpt-br%2Fnews%3Fsrsltid%3DAfmBOoqMk22pd8F4V5UHEkB9feOxBsrINMqZK6wMDqHw4VwDFIKdYqaj#plans" className="flex items-center text-[#FAB818] hover:text-orange-400">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-labelledby="premium-filled-svg" role="img">
                    <title id="premium-filled-svg">Premium</title>
                    <path fill="currentColor" d="M2.419 13L0 4.797 4.837 6.94 8 2l3.163 4.94L16 4.798 13.581 13z"></path>
                  </svg>
                  <div className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Comece um Teste Gratuito</div>
                </a>
              </li>
              <li><a href="https://www.crunchyroll.com/pt-br/about/index.html" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Sobre</a></li>
              <li><a href="https://help.crunchyroll.com/hc/pt" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Centro de Ajuda</a></li>
              <li><a href="https://www.crunchyroll.com/pt-br/tos" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Termos de Uso</a></li>
              <li><a href="https://www.crunchyroll.com/privacy/index.html" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Política de Privacidade</a></li>
              <li><a href="mailto:pr@crunchyroll.com" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Ferramenta de Consentimento de Cookies</a></li>
              <li><a href="mailto:pr@crunchyroll.com" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Solicitações de Imprensa</a></li>
              <li><a href="https://www.crunchyroll.com/pt-br/devices" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Baixe o App</a></li>
              <li><a href="https://www.crunchyroll.com/pt-br/redeem" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Resgatar Código</a></li>
              <li><a href="https://www.crunchyroll.com/about/jobs/index.html" target="_blank" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Vagas</a></li>
            </ul>
          </div>

          {/* Conta */}
          <div className='hidden md:block'>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-[#000028]"} ${isDark ? "" : "border-t-2 border-[#DADADA]"}`}>Conta</h4>
            <ul className={`space-y-2 ${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"}`}>
              <li><a href="https://sso.crunchyroll.com/authorize?client_id=opy75pstrnzw4edkr9ed&redirect_uri=https%3A%2F%2Fwww.crunchyroll.com%2Fcallback&response_type=cookie&state=%2Faccount%2Fpreferences&prompt=register" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Criar Conta</a></li>
              <li><a href="https://sso.crunchyroll.com/authorize?client_id=opy75pstrnzw4edkr9ed&redirect_uri=https%3A%2F%2Fwww.crunchyroll.com%2Fcallback&response_type=cookie&state=%2Fpt-br%2Fnews%3Fsrsltid%3DAfmBOoqMk22pd8F4V5UHEkB9feOxBsrINMqZK6wMDqHw4VwDFIKdYqaj" className={`${isDark ? "hover:text-[#FFFFFF] border-[#000000]" : "hover:text-[#000000] border-[#FFFFFF]"} hover:underline`}>Login</a></li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${isDark ? "border-[#36414B]" : "border-[#A4A5A7]"} mt-8 py-6 text-[#4A4E58]`}>
          <div className="flex flex-row sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
              <img 
                className="w-[158px] h-auto min-h-[12px] sm:h-auto mr-0 sm:mr-4 mb-2 sm:mb-0" 
                src="https://www.crunchyroll.com/news/img/footer/sony_pictures_logo_dark.png" 
                alt="Sony Pictures Logo"
              />
              <p className="text-xs sm:text-sm">© Crunchyroll, LLC</p>
            </div>
            <div className="relative">
              <button className={`flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 z-49 ${isDark ? "text-[#A4A5A7] hover:bg-gray-800" : "text-[#4A4E58] hover:bg-gray-200"}`}>
                <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-labelledby="dropdown-svg" role="img">
                  <title id="dropdown-svg">Menu dropdown</title>
                  <path fill="currentColor" d="M7 10h10l-5 5z"></path>
                </svg>
                PORTUGUÊS(BRASIL)
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

