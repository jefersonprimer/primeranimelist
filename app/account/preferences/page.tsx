"use client";

import { useState } from "react";
import Link from "next/link";

interface PreferencesState {
  displayLanguage: string;
  audioLanguage: string;
  audioDescriptions: boolean;
  subtitleLanguage: string;
  closedCaptions: boolean;
  maturityRestrictions: string;
}

export default function PreferencesPageClient() {
  const [preferences, setPreferences] = useState<PreferencesState>({
    displayLanguage: "Português (Brasil)",
    audioLanguage: "Português (Brasil)",
    audioDescriptions: false,
    subtitleLanguage: "English",
    closedCaptions: false,
    maturityRestrictions: "18",
  });

  const handleToggle = (key: keyof PreferencesState) => {
    if (key === "audioDescriptions" || key === "closedCaptions") {
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleSelectChange = (key: keyof PreferencesState, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="w-full max-w-[1050px] mx-auto px-4 sm:px-0 py-8">
          <div className="w-full mb-6 mx-auto">
            <h1 className="text-[1.75rem] font-medium text-white mb-4">
              Ajustes da Conta
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation Sidebar */}
            <nav className="w-full max-w-[280px] flex-shrink-0">
              <div className="p-6 space-y-6">
                <div>
                  <div className="space-y-2">
                    <h2 className="block px-3 py-2 text-[1.25rem] text-white font-semibold transition-colors">
                      Geral
                    </h2>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="/account/membership"
                      data-t="account-nav-membership-status"
                    >
                      Informações de Assinatura
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="/account/preferences"
                      data-t="account-nav-preferences"
                      aria-current="page"
                    >
                      Preferências
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="/account/notifications"
                      data-t="account-nav-notifications"
                    >
                      Notificações por E-mail
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="/account/devices"
                      data-t="account-nav-devices"
                    >
                      Gerenciamento de Dispositivos
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="/account/connected-apps"
                      data-t="account-nav-connected-apps"
                    >
                      Apps Conectados
                    </Link>
                  </div>
                </div>

                {/* Account Section */}
                <div>
                  <h2 className="block px-3 py-2 text-[1.25rem] text-white font-semibold transition-colors">
                    Conta
                  </h2>
                  <div className="space-y-2">
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="account/email"
                      data-t="account-nav-email"
                    >
                      E-mail
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href={`/account/phone`}
                      data-t="account-change-phone"
                    >
                      Telefone
                    </Link>
                    <Link
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href={`/account/password`}
                      data-t="account-nav-password"
                    >
                      Senha
                    </Link>
                  </div>
                </div>

                {/* Purchases & Credit Section */}
                <div>
                  <h2 className="block px-3 py-2 text-[1.25rem] text-white font-semibold transition-colors">
                    Compras & Crédito
                  </h2>
                  <div className="space-y-2">
                    <a
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="https://www.crunchyroll.com/premium/redirects?from=%2Faccount%2Fmembership"
                      data-t="account-nav-payment-info"
                    >
                      Informações de Pagamento
                    </a>
                    <a
                      className="block px-3 py-2 text-base text-[#A0A0A0] hover:text-white hover:bg-[#141519] transition-colors"
                      href="https://www.crunchyroll.com/payments/history"
                      data-t="account-nav-billing-history"
                    >
                      Histórico de Cobranças
                    </a>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <div className="w-full max-w-[780px]">
              <div className="bg-[#23252B] p-8">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Preferências para rr
                  </h1>
                  <p className="text-[#A0A0A0] text-sm">
                    Ajuste suas preferências de idiomas e vídeo
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Display Language */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Idioma de Exibição
                    </label>
                    <div className="relative">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2D35] rounded-lg text-white hover:bg-[#3A3D45] transition-colors"
                        aria-label="Idioma de Exibição"
                        data-t="display-language-select"
                      >
                        <span className="text-sm font-medium">
                          {preferences.displayLanguage}
                        </span>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 10h10l-5 5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Audio Language */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Idioma do Áudio
                    </label>
                    <div className="relative">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2D35] rounded-lg text-white hover:bg-[#3A3D45] transition-colors"
                        aria-label="Idioma do Áudio"
                        data-t="audio-language-select"
                      >
                        <span className="text-sm font-medium">
                          {preferences.audioLanguage}
                        </span>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 10h10l-5 5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Audio Descriptions Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="flex items-center cursor-pointer">
                          <input
                            className="sr-only"
                            data-t="audio-descriptions-toggle"
                            type="checkbox"
                            checked={preferences.audioDescriptions}
                            onChange={() => handleToggle("audioDescriptions")}
                          />
                          <div className="relative w-12 h-6 bg-[#4A4E58] rounded-full transition-colors">
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.audioDescriptions ? "translate-x-6" : "translate-x-1"}`}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm font-semibold text-white">
                            Descrições de áudio
                          </span>
                        </label>
                        <p className="mt-2 text-sm text-[#A0A0A0] ml-15">
                          Ao ativar esta configuração, reproduziremos
                          automaticamente as descrições em áudio quando
                          disponíveis.{" "}
                          <a
                            className="text-[#FF6B35] hover:text-[#FF8A65] underline"
                            aria-label="Perguntas frequentes de descrição em áudio - abrir em nova aba"
                            data-t="audio-descriptions-faq-link"
                            href="https://help.crunchyroll.com/hc/articles/38576836055188"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Perguntas frequentes de descrição em áudio
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subtitle Language */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Idioma de Legendas/CC
                    </label>
                    <div className="relative">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2D35] rounded-lg text-white hover:bg-[#3A3D45] transition-colors"
                        aria-label="Idioma de Legendas/CC"
                        data-t="subtitle-language-select"
                      >
                        <span className="text-sm font-medium">
                          {preferences.subtitleLanguage}
                        </span>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 10h10l-5 5z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Closed Captions Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="flex items-center cursor-pointer">
                          <input
                            className="sr-only"
                            data-t="closed-captions-toggle"
                            type="checkbox"
                            checked={preferences.closedCaptions}
                            onChange={() => handleToggle("closedCaptions")}
                          />
                          <div className="relative w-12 h-6 bg-[#4A4E58] rounded-full transition-colors">
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.closedCaptions ? "translate-x-6" : "translate-x-1"}`}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm font-semibold text-white">
                            Legendas ocultas
                          </span>
                        </label>
                        <p className="mt-2 text-sm text-[#A0A0A0] ml-15">
                          Ao ativar esta configuração, exibiremos
                          automaticamente as legendas ocultas quando
                          disponíveis.{" "}
                          <Link
                            className="text-[#FF6B35] hover:text-[#FF8A65] underline"
                            data-t="closed-captions-styling-link"
                            href={`/account/preferences/captions`}
                          >
                            Alterar aparência das legendas
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Maturity Restrictions */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-white">
                        Restrições de Maturidade
                      </label>
                      <div className="relative">
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 bg-[#2A2D35] rounded-lg text-white hover:bg-[#3A3D45] transition-colors"
                          aria-label="Restrições de Maturidade"
                          data-t="mature-menu"
                        >
                          <span className="text-sm font-medium">
                            {preferences.maturityRestrictions}
                          </span>
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M7 10h10l-5 5z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#A0A0A0]">
                      Confira nosso{" "}
                      <a
                        className="text-[#FF6B35] hover:text-[#FF8A65] underline"
                        aria-label="FAQ sobre Restições de Maturidade - abrir em nova aba"
                        target="_blank"
                        href="https://help.crunchyroll.com/hc/pt/articles/29883912641940"
                        rel="noopener noreferrer"
                      >
                        FAQ sobre Restições de Maturidade
                      </a>{" "}
                      para saber mais sobre classificação de conteúdo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
