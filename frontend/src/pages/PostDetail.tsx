import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { GET_POST } from '../graphql/queries/posts';
import { DELETE_POST } from '../graphql/mutations/posts';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/CommentList/CommentList';
import CommentForm from '../components/CommentForm/CommentForm';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_POST, {
    variables: { id },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      navigate('/posts');
    },
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id } });
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading post: {error.message}</Alert>;
  }

  const post = data?.post;
  const isAuthor = post?.author?.id === user?.id;

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {post?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              By {post?.author?.username} • {new Date(post?.createdAt).toLocaleDateString()}
            </Typography>
            {post?.published ? (
              <Typography variant="body2" color="success.main" component="span">
                Published
              </Typography>
            ) : (
              <Typography variant="body2" color="warning.main" component="span">
                Draft
              </Typography>
            )}
          </Box>
          {isAuthor && (
            <Box>
              <IconButton onClick={() => navigate(`/posts/${id}/edit`)}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post?.content}
        </Typography>
      </Paper>
      <CommentList postId={id!} />
      <CommentForm postId={id!} onCommentAdded={refetch} />
    </Box>
  );
};

export default PostDetail;
