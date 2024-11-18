/* eslint-disable */

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { CircularProgress, Box } from '@mui/material';

export default function CourseView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const token = localStorage.getItem('token'); 
      const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario desde localStorage
  
      if (!user || !user.email) {
        console.error('User not found in localStorage or email missing');
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/details-by-email/${user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token al header de Authorization
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
  
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);
  

  const getYouTubeThumbnail = (url) => {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Cursos Nomativos</Typography>
      </Stack>

      <Grid container spacing={3}>
        {courses.map(({ course }) => (
          <Grid key={course.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                maxWidth: 345,
                borderRadius: 3,
                backgroundColor: '#1a1a1a',
                color: 'white',
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={getYouTubeThumbnail(course.urlVideo)}
                alt={course.name}
                sx={{ borderRadius: '10px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ color: '#fff' }}>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#b0b0b0' }}>
                  {course.descripcion.slice(0, 100)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
