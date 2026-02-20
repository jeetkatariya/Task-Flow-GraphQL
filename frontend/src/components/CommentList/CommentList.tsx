import { useQuery } from '@apollo/client';
import { Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { GET_POST } from '../../graphql/queries/posts';

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: postId },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading comments: {error.message}</Alert>;
  }

  const comments = data?.post?.comments || [];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {comments.map((comment: any) => (
            <Paper key={comment.id} sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {comment.author.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1">{comment.content}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
