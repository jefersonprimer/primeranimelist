"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { DropdownIcon } from '@/app/components/icons/DropdownIcon';

interface UserProfileButtonProps {
  isDark: boolean;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ isDark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const userProfile = user
    ? { display_name: user.fullName ?? user.email, profile_image_url: null }
    : null;
  const isLoading = loading;
  const checkAuthState = async () => {};

  const handleUserClick = async () => {
    await checkAuthState();
    setIsModalOpen(!isModalOpen);
  };

  if (isLoading) {
    return (
      <div className={`px-4 py-[21px] lg:py-[10px] ${isDark ? "text-white" : "text-[#4A4E62]"}`}>
        <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={handleUserClick}
        className={`cursor-pointer ${isDark ? "text-white hover:bg-[#4A4E58]" : "text-[#4A4E62] hover:bg-[#E6E5E3]"} ${isModalOpen ? "bg-[#2B2D32]" : ""} hover:text-[#008382] transition-colors px-4 py-[21px] lg:py-[10px] group-hover:text-[#008382] group`}
      >
        {userProfile ? (
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={userProfile.profile_image_url || '/default-avatar.png'}
                alt="User profile"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <DropdownIcon className={`${isDark ? "text-[#A0A0A0]" : "text-[#A0A0A0]"}`} />
          </div>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`stroke-[#52565F] group-hover:stroke-[#2ABDBB] ${isDark ? "stroke-white" : ""} ${isModalOpen ? "stroke-[#2ABDBB]" : ""}`}
          >
            <path
              d="M16.1907 14.6737C19.9366 14.6737 22.9732 11.6328 22.9732 7.88155C22.9732 4.13032 19.9366 1.08936 16.1907 1.08936C12.4448 1.08936 9.4082 4.13032 9.4082 7.88155C9.4082 11.6328 12.4448 14.6737 16.1907 14.6737Z"
              strokeWidth="2"
            ></path>
            <path
              d="M2 17.8427L16.1894 15.0577L30.3787 17.8427C30.3787 22.2477 24.0219 29.5088 16.1894 29.5088C8.35683 29.5088 2 22.2477 2 17.8427Z"
              strokeWidth="2"
            ></path>
          </svg>
        )}
      </button>

      {/* Modal posicionado abaixo do ícone */}
      {isModalOpen && (
        <div className={`
          fixed md:absolute 
          inset-0 md:inset-auto 
          z-[1000] 
          md:right-0 md:top-full 
          w-[300px]
          h-[468px]
          m-0
          ${isDark ? "bg-[#2B2D32]" : "bg-white"} 
          overflow-y-auto
        `}>
          {userProfile ? (
            <>
              {/* User profile section */}
              <div className={`px-4 py-3 ${isDark ? "hover:bg-[#4A4E58]" : "hover:bg-[#E6E5E3]"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={userProfile.profile_image_url || '/default-avatar.png'}
                      alt="User profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? "text-white" : "text-[#000000]"}`}>
                      {userProfile.display_name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Account options */}
              <div>
                <ul>
                  <li className='flex items-center justify-center'>
                    <a 
                      href="https://www.crunchyroll.com/pt-br/premium?referrer=newweb_organic_acct_menu_news&return_url=https%3A%2F%2Fwww.crunchyroll.com%2Fpt-br%2Fnews#plans" 
                      className="flex items-center gap-2 text-[#000] font-bold bg-[#FABB18] p-2 my-2 w-[252px] h-[38px] justify-center" 
                    >
                      <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7733 5.76876L12.1951 6.37871L12.9012 6.15222L16.5297 4.98844L14.5439 12H3.45612L1.47001 4.98733L5.10881 6.15238L5.8156 6.37867L6.23694 5.76774L9.00109 1.75978L11.7733 5.76876Z" stroke="black" strokeWidth="2"></path>
                      </svg>
                      TESTE GRÁTIS
                    </a>
                  </li>
                  <li className='hover:bg-[#4A4E58] py-4 px-8'>
                    <a 
                      href="/watchlist" 
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5">
                        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16.11L8.74 13.78C8.23 13.42 7.62 13.22 7 13.22C6.37 13.22 5.77 13.41 5.26 13.78L2 16.11V2H12V16.11ZM13 0H1C0.45 0 0 0.45 0 1V18.06C0 18.27 0.07 18.47 0.19 18.64C0.51 19.09 1.13 19.2 1.58 18.88L6.42 15.43C6.77 15.18 7.23 15.18 7.58 15.43L12.42 18.88C12.87 19.2 13.49 19.1 13.81 18.65C13.93 18.48 14 18.28 14 18.07V1C14 0.45 13.55 0 13 0Z" fill="#A0A0A0"></path>
                        </svg>
                      </div>
                      <h5 className="text-base">Fila</h5>
                    </a>
                  </li>
                  <li className='hover:bg-[#4A4E58] py-4 px-8'>
                    <a 
                      href="/watchlist" 
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5">
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1921_74073)">
                            <path d="M20 12V14H4V12H20ZM1 12C1.55 12 2 12.45 2 13C2 13.55 1.55 14 1 14C0.45 14 0 13.55 0 13C0 12.45 0.45 12 1 12ZM20 6V8H4V6H20ZM1 6C1.55 6 2 6.45 2 7C2 7.55 1.55 8 1 8C0.45 8 0 7.55 0 7C0 6.45 0.45 6 1 6ZM20 0V2H4V0H20ZM1 0C1.55 0 2 0.45 2 1C2 1.55 1.55 2 1 2C0.45 2 0 1.55 0 1C0 0.45 0.45 0 1 0Z" fill="#A0A0A0"></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_1921_74073">
                              <rect width="20" height="14" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <h5 className="text-base">Crunchylistas</h5>
                    </a>
                  </li>
                  <li className='hover:bg-[#4A4E58] py-4 px-8'>
                    <a 
                      href="/watchlist" 
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5">
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1921_74075)">
                            <path d="M11 5C11 4.45 11.45 4 12 4C12.55 4 13 4.45 13 5V10.41L9.71 13.7C9.31 14.08 8.68 14.07 8.3 13.68C7.93 13.29 7.93 12.68 8.3 12.29L11.01 9.58V5H11ZM12 0C17.51 0 22 4.49 22 10C22 15.51 17.51 20 12 20C9.54 20 7.17 19.1 5.33 17.45C4.92 17.09 4.87 16.45 5.24 16.04C5.6 15.63 6.24 15.58 6.65 15.95C6.65 15.95 6.65 15.95 6.66 15.96C8.13 17.27 10.03 18 11.99 18C16.4 18 19.99 14.41 19.99 10C19.99 5.59 16.41 2 12 2C7.93 2 4.56 5.06 4.07 9H6L3 12L0 9H2.05C2.55 3.95 6.82 0 12 0Z" fill="#A0A0A0"></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_1921_74075">
                              <rect width="22" height="20" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <h5 className="text-base">Histórico</h5>
                    </a>
                  </li>
                </ul>
                <ul className="my-2 py-2 border-y border-[#4A4E58]">
                <li className='hover:bg-[#4A4E58] py-4 px-8'>
                    <a 
                      href="https://www.crunchyroll.com/account/preferences" 
                      className="flex items-center gap-2"
                    >
                      <div className="w-5 h-5">
                        <svg width="16" height="20" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.1907 14.6737C19.9366 14.6737 22.9732 11.6328 22.9732 7.88155C22.9732 4.13032 19.9366 1.08936 16.1907 1.08936C12.4448 1.08936 9.4082 4.13032 9.4082 7.88155C9.4082 11.6328 12.4448 14.6737 16.1907 14.6737Z" stroke="currentColor" strokeWidth="2.10213" strokeMiterlimit="10"></path>
                          <path d="M2 17.8427L16.1894 15.0577L30.3787 17.8427C30.3787 22.2477 24.0219 29.5088 16.1894 29.5088C8.35683 29.5088 2 22.2477 2 17.8427Z" stroke="currentColor" strokeWidth="2.10213" strokeMiterlimit="10"></path>
                        </svg>
                      </div>
                      <div>
                        <h5 className="text-base">My Account</h5>
                        <p className="text-sm text-[#A0A0A0]">Manage your profile and settings.</p>
                      </div>
                    </a>
                  </li>
                </ul>
                <ul>
                  <li className='hover:bg-[#4A4E58] py-4 px-8'>
                  <button onClick={async () => {
                    await logout();
                  }} 
                  className='flex items-center gap-2 cursor-pointer'
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    data-t="sign-out-svg" 
                    aria-labelledby="sign-out-svg" 
                    aria-hidden="true" 
                    role="img"
                    width="24"
                    height="24"
                    fill='#A0A0A0'
                    >
                      <path d="M15 15a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V4H6v16h8v-4a1 1 0 0 1 1-1zm8.923-2.618a1 1 0 0 1-.217.326l-4 3.999A.993.993 0 0 1 19 17a.999.999 0 0 1-.707-1.707L20.586 13H15a1 1 0 0 1 0-2h5.586l-2.293-2.293a.999.999 0 1 1 1.414-1.414l3.999 4a.992.992 0 0 1 .217 1.089z"></path>
                  </svg>
                    <span>Sair</span>
                  </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Login options for non-authenticated users */}
              <div className={`px-4 py-3 ${isDark ? "hover:bg-[#4A4E58]" : "hover:bg-[#E6E5E3]"}`}>
                <a href="https://sso.crunchyroll.com/authorize?client_id=opy75pstrnzw4edkr9ed&redirect_uri=https%3A%2F%2Fwww.crunchyroll.com%2Fcallback&response_type=cookie&state=%2Faccount%2Fpreferences&prompt=register" className="block">
                  <h3 className={`text-xl ${isDark ? "text-white" : "text-[#000000]"}`}>Criar Conta</h3>
                  <p className={`${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"} text-sm mt-1`}>Cadastre-se de graça ou torne-se Premium.</p>
                </a>
              </div>

              <div className={`px-4 py-3 ${isDark ? "hover:bg-[#4A4E58]" : "hover:bg-[#E6E5E3]"}`}>
                <a href="https://sso.crunchyroll.com/authorize?client_id=opy75pstrnzw4edkr9ed&redirect_uri=https%3A%2F%2Fwww.crunchyroll.com%2Fcallback&response_type=cookie&state=%2Fpt-br%2Fnews%3Fsrsltid%3DAfmBOoqMk22pd8F4V5UHEkB9feOxBsrINMqZK6wMDqHw4VwDFIKdYqaj" className="block">
                  <h3 className={`text-xl ${isDark ? "text-white" : "text-[#000000]"}`}>Login</h3>
                  <p className={`${isDark ? "text-[#A0A0A0]" : "text-[#4A4E58]"} text-sm mt-1`}>Já é membro da Crunchyroll? Seja bem-vindo.</p>
                </a>
              </div>

              {/* Premium trial button */}
              <div className="px-4 py-3">
                <a 
                  href="https://www.crunchyroll.com/pt-br/premium?referrer=newweb_organic_acct_menu_news&return_url=https%3A%2F%2Fwww.crunchyroll.com%2Fpt-br%2Fnews#plans" 
                  className="flex items-center justify-center gap-2 bg-[#FABB18] hover:bg-[#e6a900] text-black font-medium py-2 px-4 transition-colors w-full"
                >
                  <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7733 5.76876L12.1951 6.37871L12.9012 6.15222L16.5297 4.98844L14.5439 12H3.45612L1.47001 4.98733L5.10881 6.15238L5.8156 6.37867L6.23694 5.76774L9.00109 1.75978L11.7733 5.76876Z" stroke="black" strokeWidth="2"></path>
                  </svg>
                  TESTE GRÁTIS
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;

