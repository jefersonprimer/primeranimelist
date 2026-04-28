"use client";

interface Props {
  audioFilter: string;
  onChange?: (filter: string) => void;
}

export default function AudioDropdown({ audioFilter, onChange }: Props) {
  const t = useTranslations("newReleases");
  // Helper to handle click
  const handleClick = (filter: string, href: string) => {
    if (onChange) {
      onChange(filter);
    } else {
      window.location.href = href;
    }
  };
  return (
    <div className="relative ml-4">
      <div
        onClick={() => toggleDropdown("audio")}
        className={`p-2.5 flex items-center border-none cursor-pointer uppercase text-[#A0A0A0] hover:text-white ${
          activeDropdown === "audio"
            ? "bg-[#23252B] text-white"
            : "bg-transparent"
        } hover:bg-[#23252B]`}
      >
        <svg
          className="w-6 h-6 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          data-t="filter-svg"
          aria-hidden="true"
          role="img"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2M3 8a1 1 0 0 1 0-2h2.142c.447-1.72 2-3 3.858-3s3.411 1.28 3.858 3H21a1 1 0 0 1 0 2h-8.142c-.447 1.72-2 3-3.858 3S5.589 9.72 5.142 8H3zm12 11c1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2 .897 2 2 2zm6-3a1 1 0 0 1 0 2h-2.142c-.447 1.72-2 3-3.858 3s-3.411-1.28-3.858-3H3a1 1 0 0 1 0-2h8.142c.447-1.72 2-3 3.858-3s3.411 1.28 3.858 3H21z"
          ></path>
        </svg>
        <span className="cursor-pointer text-sm font-bold">
          {t("filters.audio.label")}
        </span>
      </div>
      {activeDropdown === "audio" && (
        <div className="cursor-pointer flex flex-col absolute top-full right-0 bg-[#23252B] py-2.5 z-10 w-[200px]">
          <span className="px-2.5 py-1 text-lg">
            {t("filters.audio.language")}
          </span>
          <div
            onClick={() => handleClick("subtitled_dubbed", "/videos/popular")}
            className={`px-2.5 py-2 text-[#A0A0A0] flex items-center gap-2 hover:bg-[#1D1E22] hover:text-white ${
              audioFilter === "subtitled_dubbed"
                ? "text-white border-[#2ABDBB]"
                : ""
            }`}
          >
            <span
              className={`relative w-[18px] h-[18px] border-2 border-[#A0A0A0] rounded-full inline-block cursor-pointer hover:border-white ${
                audioFilter === "subtitled_dubbed" ? "border-[#2ABDBB]" : ""
              }`}
            >
              <span
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-[#2ABDBB] rounded-full ${
                  audioFilter === "subtitled_dubbed"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              ></span>
            </span>
            {t("filters.audio.options.all")}
          </div>
          <div
            onClick={() =>
              handleClick("subtitled", "/videos/popular?lang=subtitled")
            }
            className={`px-2.5 py-2 text-[#A0A0A0] flex items-center gap-2 hover:bg-[#1D1E22] hover:text-white ${
              audioFilter === "subtitled" ? "text-white border-[#2ABDBB]" : ""
            }`}
          >
            <span
              className={`relative w-[18px] h-[18px] border-2 border-[#A0A0A0] rounded-full inline-block cursor-pointer hover:border-white ${
                audioFilter === "subtitled" ? "border-[#2ABDBB]" : ""
              }`}
            >
              <span
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-[#2ABDBB] rounded-full ${
                  audioFilter === "subtitled" ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </span>
            {t("filters.audio.options.subtitled")}
          </div>
          <div
            onClick={() => handleClick("dubbed", "/videos/popular?lang=dubbed")}
            className={`px-2.5 py-2 text-[#A0A0A0] flex items-center gap-2 hover:bg-[#1D1E22] hover:text-white ${
              audioFilter === "dubbed" ? "text-white border-[#2ABDBB]" : ""
            }`}
          >
            <span
              className={`relative w-[18px] h-[18px] border-2 border-[#A0A0A0] rounded-full inline-block cursor-pointer hover:border-white ${
                audioFilter === "dubbed" ? "border-[#2ABDBB]" : ""
              }`}
            >
              <span
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-[#2ABDBB] rounded-full ${
                  audioFilter === "dubbed" ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </span>
            {t("filters.audio.options.dubbed")}
          </div>
        </div>
      )}
    </div>
  );
}
