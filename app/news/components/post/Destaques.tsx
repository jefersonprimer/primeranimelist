import DestaqueCarousel from "./DestaqueCarousel";
import DestaquesGrid from "./DestaquesGrid";
import { Post } from "../../types/posts";

type DestaquesProps = {
  posts: Post[];
};

const Destaques: React.FC<DestaquesProps> = ({ posts }) => {
  return (
    <div className="lg:border-x-2 border-[#A0A0A0] px-2">
      <DestaqueCarousel posts={posts} />
      <DestaquesGrid posts={posts} />
    </div>
  );
};

export default Destaques;


