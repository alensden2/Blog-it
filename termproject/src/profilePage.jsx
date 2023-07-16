import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import { Button, TextField, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [blogText, setBlogText] = useState('');
    const email = localStorage.getItem('email');
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('API_ENDPOINT', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Call API to save the blog
        // Update the blogs state
        // Clear the blog text and hide the form
        setBlogText('');
        setShowForm(false);
    };

    const handleGoBack = () => {
        setShowForm(false);
    };

    

    return (
        <div>
            <Navbar showThreeDotMenu={true} showNotifications={true} />

            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h1>Welcome to your profile {email}</h1>
                {showForm ? (
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Write your blog"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={blogText}
                            onChange={(e) => setBlogText(e.target.value)}
                            required
                            sx={{ marginBottom: '1rem' }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Box sx={{ marginTop: '1rem' }}>
                            <Link component="button" variant="body2" onClick={handleGoBack}>
                                Go back to all blogs
                            </Link>
                        </Box>
                    </form>
                ) : (
                    <div>
                        {blogs.length === 0 ? (
                            <Typography variant="body1">No blogs available</Typography>
                        ) : (
                            blogs.map((blog) => (
                                <div key={blog.id}>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.content}</p>
                                </div>
                            ))
                        )}
                        <Box sx={{ marginTop: '2rem' }}>
                            <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
                                Add Blog
                            </Button>
                        </Box>
                    </div>
                )}
            </div>
        </div>
    );
}
