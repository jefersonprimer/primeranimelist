import React, { useState, useEffect, useMemo } from "react";

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  type: "profile" | "background";
  currentImage: string;
}

interface Image {
  id: string;
  anime_name: string;
  image_url: string;
}

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&size=256";

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  type,
  currentImage,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [customImageUrl, setCustomImageUrl] = useState<string>(currentImage);
  const [loading, setLoading] = useState(true);

  // Agrupar imagens por nome do anime
  const groupedImages = useMemo(() => {
    const groups: { [key: string]: Image[] } = {};
    images.forEach((image) => {
      if (!groups[image.anime_name]) {
        groups[image.anime_name] = [];
      }
      groups[image.anime_name].push(image);
    });
    return groups;
  }, [images]);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage);
      setCustomImageUrl(currentImage);
      fetchImages();
    }
  }, [isOpen, currentImage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const endpoint =
        type === "profile"
          ? "http://localhost:3000/api/profile-images"
          : "http://localhost:3000/api/background-images";

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#141519] w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col">
          {type === "profile" ? (
            // Layout para seleção de imagem de perfil
            <div className="w-full relative">
              {/* Botão de fechar no canto superior direito */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 z-10 bg-[#23252B] bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-start gap-4 p-4 bg-[#2B2E34]">
                {/* Imagem de perfil */}
                <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={selectedImage || DEFAULT_AVATAR}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Textos e botões ao lado direito */}
                <div className="flex flex-col justify-between h-48 flex-1">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-white">
                      Select Profile Picture
                    </h2>
                    <h3 className="text-[#A0A0A0] mb-2">
                      Selected Image
                    </h3>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomImageUrl(value);
                        setSelectedImage(value);
                      }}
                      placeholder="Paste profile image URL"
                      className="w-full mt-2 px-3 py-2 bg-[#141519] text-[#E4E4E4] border border-[#59595B] focus:outline-none focus:border-[#FF640A]"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => onSelect(selectedImage)}
                      className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    >
                      <span className="text-sm font-bold uppercase">
                        Save
                      </span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border-2 border-[#FF640A] text-[#FF640A] opacity-90 hover:opacity-100 cursor-pointer"
                    >
                      <span className="text-sm font-bold uppercase">
                        Cancel
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Layout para seleção de imagem de fundo (mantém o original)
            <>
              <div className="w-full">
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={
                      selectedImage ||
                      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80&auto=format&fit=crop"
                    }
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-[#23252B] bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition-all duration-200 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-4 p-2 bg-[#2B2E34]">
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-white">
                    Select Background Image
                  </h2>
                  <h3 className="text-[#A0A0A0] mb-2">Selected Image</h3>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomImageUrl(value);
                      setSelectedImage(value);
                    }}
                    placeholder="Paste background image URL"
                    className="w-[360px] max-w-full px-3 py-2 bg-[#141519] text-[#E4E4E4] border border-[#59595B] focus:outline-none focus:border-[#FF640A]"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => onSelect(selectedImage)}
                    className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <span className="text-sm font-bold uppercase">
                      Save
                    </span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border-2 border-[#FF640A] text-[#FF640A] opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <span className="text-sm font-bold uppercase">
                      Cancel
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-[#23252B]">
          {loading ? (
            <div className="text-center text-white">Loading images...</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedImages).map(([animeName, animeImages]) => (
                <div key={animeName} className="space-y-3">
                  {/* Título do anime */}
                  <h3 className="text-lg font-semibold text-white">
                    {animeName}
                  </h3>

                  {/* Grid de imagens do anime */}
                  <div
                    className={`grid gap-3 ${
                      type === "profile"
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {animeImages.map((image) => (
                      <div
                        key={image.id}
                        className={`hover:border-4 hover:border-white cursor-pointer ${
                          type === "profile" ? "rounded-full" : ""
                        } overflow-hidden border-2 ${
                          selectedImage === image.image_url
                            ? "border-4 border-[#FF640A]"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          setSelectedImage(image.image_url);
                          setCustomImageUrl(image.image_url);
                        }}
                      >
                        <img
                          src={image.image_url}
                          alt={image.anime_name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectionModal;
