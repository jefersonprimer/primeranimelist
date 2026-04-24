import PostCard from "../post/PostCard";
import { Post } from "../../types/posts";
import { useTheme } from "../../context/ThemeContext"; 
import Link from "next/link";
import PostCardRows from "../post/PostCardRows";

type FilteredPostGridRowsProps = {
  posts: Post[];
  category: string;
  limit: number;
  viewMoreLink?: string;
};

const FilteredPostGridRows: React.FC<FilteredPostGridRowsProps> = ({
  posts,
  category,
  limit,
  viewMoreLink,
}) => {
  const { isDark } = useTheme(); // Pegando o estado do tema

  // Filtra os posts pela categoria recebida via props
  const filteredPosts = posts.filter((post) => post.category === category);

  if (filteredPosts.length === 0) {
    return <p className="text-center text-gray-500">Nenhum post encontrado.</p>;
  }

  // Limita a quantidade de posts exibidos
  const displayedPosts = filteredPosts.slice(0, limit);

  return (
    <div>
      {displayedPosts.length > 0 && (
        <>
          {/* Exibir posts um abaixo do outro (em rows) */}
          <div className="flex flex-col gap-4"> {/* Flex em coluna */}
            {displayedPosts.map((post) => (
              <div key={post.id}>
                <PostCardRows post={post} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Se houver mais posts que o limite, exibir botão "Ver mais" */}
      {filteredPosts.length > limit && viewMoreLink && (
        <div className="text-center mt-4">
          <Link
            href={viewMoreLink}
            className={`px-4 py-2 ${isDark ? "text-white bg-blue-600" : "text-white bg-blue-600"} hover:bg-blue-700 transition rounded-md`}
          >
            Ver mais
          </Link>
        </div>
      )}
    </div>
  );
};

export default FilteredPostGridRows;


