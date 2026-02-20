import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    author: {
      id: string;
      username: string;
    };
    comments?: Array<{ id: string }>;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const truncatedContent = post.content.length > 200
    ? post.content.substring(0, 200) + '...'
    : post.content;

  return (
    <Card
      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h5" component="h2">
            {post.title}
          </Typography>
          <Chip
            label={post.published ? 'Published' : 'Draft'}
            color={post.published ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {truncatedContent}
        </Typography>
        {post.comments && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
