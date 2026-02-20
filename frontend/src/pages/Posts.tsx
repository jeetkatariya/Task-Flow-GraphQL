import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GET_POSTS } from '../graphql/queries/posts';
import PostCard from '../components/PostCard/PostCard';

const Posts: React.FC = () => {
  const navigate = useNavigate();
  const [publishedFilter, setPublishedFilter] = useState<boolean | null | string>(true);

  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { published: publishedFilter },
  });

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: boolean | null | string,
  ) => {
    if (newFilter !== null) {
      setPublishedFilter(newFilter === 'all' ? null : newFilter);
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
    return <Alert severity="error">Error loading posts: {error.message}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Posts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/posts/new')}
        >
          New Post
        </Button>
      </Box>
      <ToggleButtonGroup
        value={publishedFilter}
        exclusive
        onChange={handleFilterChange}
        aria-label="post filter"
        sx={{ mb: 3 }}
      >
        <ToggleButton value={true} aria-label="published">
          Published
        </ToggleButton>
        <ToggleButton value={false} aria-label="drafts">
          Drafts
        </ToggleButton>
        <ToggleButton value="all" aria-label="all">
          All
        </ToggleButton>
      </ToggleButtonGroup>
      {data?.posts?.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No posts found.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data?.posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Posts;
