import PostCard from './PostCardRows';
import { Post } from '../../types/posts';

type PostGridRowsProps = {
  posts: Post[];
};

const PostGridRows: React.FC<PostGridRowsProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostGridRows;


