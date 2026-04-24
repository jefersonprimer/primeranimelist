"use client";

import React from 'react';
import Link from 'next/link';
import { NavItem } from '../types/types';
import { useTheme } from "../../../context/ThemeContext"; 

interface MobileMenuProps {
  isOpen: boolean;
  isDark: boolean;
  navItems: NavItem[];
  openMobileAccordion: string | null;
  toggleMobileAccordion: (label: string) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  isDark, 
  navItems, 
  openMobileAccordion, 
  toggleMobileAccordion,
  onClose,
}) => {
  const { toggleTheme } = useTheme();
  
  if (!isOpen) return null;

  // Calcular a altura total baseada nos itens abertos
  const calculateTotalHeight = () => {
    const baseHeight = 540; // Altura base estava 660
    if (!openMobileAccordion) return baseHeight;
    
    const activeItem = navItems.find(item => item.label === openMobileAccordion);
    if (!activeItem?.subLinks) return baseHeight;
    
    // Adicionar 40px por cada sublink (ajuste conforme necessário)
    return baseHeight + (activeItem.subLinks.length * 40);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-start`}>
      <div 
        className={`w-[300px] ${isDark ? 'bg-black' : 'bg-[#FFFFFF]'}`}
        style={{ height: `${calculateTotalHeight()}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full flex flex-col">
          {/* Botão de fechar no topo */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold hover:opacity-70 cursor-pointer"
          >
            <svg width="27" height="29" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="24.549" y1="26.3375" x2="2.47668" y2="2.92594" stroke="#2ABDBB" strokeWidth="5.25532"></line><line x1="2.47676" y1="26.1738" x2="24.5491" y2="2.7622" stroke="#2ABDBB" strokeWidth="5.25532"></line></svg>
          </button>
          
          {/* Conteúdo principal - removido overflow-y-auto */}
          <div className="mt-10 space-y-4 flex-grow pl-4">
            <Link href="/" className='flex justify-start items-center'>Página Principal</Link>
            {navItems.map((item) => (
              <div key={item.label}>
                <div 
                  className="flex justify-between items-center"
                  onClick={() => toggleMobileAccordion(item.label)}
                >
                  <Link 
                    href={item.href}
                    className="block font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.subLinks && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transform transition-transform ${openMobileAccordion === item.label ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                {item.subLinks && openMobileAccordion === item.label && (
                  <div className="pl-4 pb-2 space-y-2">
                    {item.subLinks.map((subLink) => (
                      <Link 
                        key={subLink.label} 
                        href={subLink.href}
                        className={`block py-2 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"}`}
                        onClick={onClose}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link href="/" className='flex justify-start items-center bg-[#008382] text-[#FFFFFF] py-2 px-4'>
            Página Principal da Crunchyroll
          </Link>
          
          {/* Container dos botões no final - modificado para ocupar metade cada */}
          <div className="flex justify-between items-center border-t">
            {/* Botão de tema (50% width) - agora com tamanho original e centralizado */}
            <div className="w-1/2 h-20 flex justify-center items-center bg-[#DADADA]">
              <button
                onClick={toggleTheme}
                className={`relative flex h-6 w-12 items-center rounded-full p-1 transition-colors duration-300 ${
                  isDark ? 'bg-[#FABB18]' : 'bg-[#4A4E58]'
                } hover:scale-110 hover:transform`}
                aria-label="Toggle theme"
              >
                <div
                  className={`absolute h-4 w-4 rounded-full transition-all duration-300 ${
                    isDark ? 'bg-[#2B2D32]' : 'bg-[#D7D7D7]'
                  } ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
                />

                <div className={`absolute left-1 top-1/2 -translate-y-1/2 ${isDark ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>         
                  <svg 
                    width="17" height="17" viewBox="0 0 17 17" fill="none"
                    className={`${isDark ? 'text-[#2B2D32]' : 'text-[#D8D8D8]'}`}
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.20992 11.76C6.29902 11.76 4.74992 10.2109 4.74992 8.30003C4.74992 6.38912 6.29902 4.84003 8.20992 4.84003C10.1208 4.84003 11.6699 6.38912 11.6699 8.30003C11.6699 10.2109 10.1208 11.76 8.20992 11.76Z" fill="currentColor"></path>
                    <path d="M8.20996 3.82002C8.75996 3.82002 9.20996 3.37002 9.20996 2.82002V1.27002C9.20996 0.72002 8.75996 0.27002 8.20996 0.27002C7.65996 0.27002 7.20996 0.72002 7.20996 1.27002V2.82002C7.20996 3.37002 7.65996 3.82002 8.20996 3.82002Z" fill="currentColor"></path>
                    <path d="M8.20996 16.33C8.75996 16.33 9.20996 15.88 9.20996 15.33V13.78C9.20996 13.23 8.75996 12.78 8.20996 12.78C7.65996 12.78 7.20996 13.23 7.20996 13.78V15.33C7.20996 15.88 7.65996 16.33 8.20996 16.33Z" fill="currentColor"></path>
                    <path d="M4.34027 5.42014C4.60027 5.42014 4.85027 5.32014 5.05027 5.13014C5.44027 4.74014 5.44027 4.11014 5.05027 3.72014L3.95027 2.62014C3.56027 2.23014 2.93027 2.23014 2.54027 2.62014C2.15027 3.01014 2.15027 3.64014 2.54027 4.03014L3.64027 5.13014C3.84027 5.33014 4.09027 5.42014 4.35027 5.42014H4.34027Z" fill="currentColor"></path>
                    <path d="M13.1899 14.27C13.4499 14.27 13.6999 14.17 13.8999 13.98C14.2899 13.59 14.2899 12.96 13.8999 12.57L12.7999 11.47C12.4099 11.08 11.7799 11.08 11.3899 11.47C10.9999 11.86 10.9999 12.49 11.3899 12.88L12.4899 13.98C12.6899 14.18 12.9399 14.27 13.1999 14.27H13.1899Z" fill="currentColor"></path>
                    <path d="M1.18047 9.2998H2.73047C3.28047 9.2998 3.73047 8.8498 3.73047 8.2998C3.73047 7.7498 3.28047 7.2998 2.73047 7.2998H1.18047C0.63047 7.2998 0.18047 7.7498 0.18047 8.2998C0.18047 8.8498 0.63047 9.2998 1.18047 9.2998Z" fill="currentColor"></path>
                    <path d="M13.7 9.30005H15.25C15.8 9.30005 16.25 8.85005 16.25 8.30005C16.25 7.75005 15.8 7.30005 15.25 7.30005H13.7C13.15 7.30005 12.7 7.75005 12.7 8.30005C12.7 8.85005 13.15 9.30005 13.7 9.30005Z" fill="currentColor"></path>
                    <path d="M3.24027 14.2702C3.50027 14.2702 3.75027 14.1702 3.95027 13.9802L5.05027 12.8802C5.44027 12.4902 5.44027 11.8602 5.05027 11.4702C4.66027 11.0802 4.03027 11.0802 3.64027 11.4702L2.54027 12.5702C2.15027 12.9602 2.15027 13.5902 2.54027 13.9802C2.73027 14.1802 2.99027 14.2702 3.25027 14.2702H3.24027Z" fill="currentColor"></path>
                    <path d="M12.0899 5.42001C12.3499 5.42001 12.5999 5.32001 12.7999 5.13001L13.8999 4.03001C14.2899 3.64002 14.2899 3.01001 13.8999 2.62001C13.5099 2.23001 12.8799 2.23001 12.4899 2.62001L11.3899 3.72001C10.9999 4.11001 10.9999 4.74002 11.3899 5.13001C11.5799 5.33001 11.8399 5.42001 12.0999 5.42001H12.0899Z" fill="currentColor"></path>
                  </svg>
                </div>

                <div className={`absolute right-1 top-1/2 -translate-y-1/2 ${isDark ? 'opacity-100' : 'opacity-100'} transition-opacity duration-300`}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={`${isDark ? 'text-[#2B2D32]' : 'text-[#D8D8D8]'}`}>
                    <path
                      d="M5.60043 6.76999C3.97043 4.91999 3.68043 2.38999 4.63043 0.299988C3.76043 0.529988 2.93043 0.939988 2.20043 1.54999C-0.429567 3.74999 -0.729567 7.60999 1.53043 10.17C3.79043 12.73 7.75043 13.02 10.3804 10.82C11.1104 10.21 11.6504 9.46999 12.0204 8.66999C9.75043 9.27999 7.23043 8.61999 5.60043 6.76999Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Botão de login (50% width) */}
            <div className="w-1/2 h-20 flex justify-center bg-[#4A4E58]">
              <button className="p-2 hover:opacity-70 transition-opacity rounded">
                <svg width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.916016 7.16665L6.04102 25.9583H29.9577L35.0827 7.16665L24.8248 10.5833L17.9993 0.333313L11.1921 10.5833L0.916016 7.16665Z" fill="#FAB818"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

