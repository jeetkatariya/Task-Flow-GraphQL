import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { CREATE_COMMENT } from '../../graphql/mutations/comments';
import { GET_POST } from '../../graphql/queries/posts';

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string>('');
  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { id: postId } }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setError('');
      await createComment({
        variables: {
          createCommentInput: {
            postId,
            content: content.trim(),
          },
        },
      });
      setContent('');
      onCommentAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add a Comment
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !content.trim()}
          sx={{ mt: 2 }}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </Box>
  );
};

export default CommentForm;
