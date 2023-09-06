import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import { Button, TextField, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


export default function ProfilePage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [blogText, setBlogText] = useState('');
    const email = localStorage.getItem('email');
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        const GET_BLOGS_API = `${process.env.REACT_APP_API_ENDPOINT}/test/allblogs`;

        axios.get(GET_BLOGS_API, {
            params: {
                email: email,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log(response.data);
                setBlogs(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        try {
            // sort_key
            const blog_id = uuidv4()
            //response object
            const ADD_USER_BLOG_POST_API_GATEWAY = `${process.env.REACT_APP_API_ENDPOINT}/test/add-blog`
            const request = {
                email: email,
                blog_id: blog_id,
                content: blogText
            }

            axios.post(ADD_USER_BLOG_POST_API_GATEWAY, request).then(res => {
                console.log("Success : ", res)
                alert("Post Posted!");
                navigate("/profilePage");
            }).catch(err => {
                console.log(err)
            })

            // Call API to save the blog
            // Update the blogs state
            // Clear the blog text and hide the form
            setBlogText('');
            setShowForm(false);
        } catch (e) {
            console.log(e)
        }

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
                        <div>
                          {blogs.map((blog, index) => (
                            <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                              <h3 style={{ marginBottom: '0.5rem' }}>Author: {blog.email}</h3>
                              <p style={{ whiteSpace: 'pre-line' }}>{blog.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <Box sx={{ marginTop: '2rem' }}>
                        <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
                          Add Blog
                        </Button>
                      </Box>
                    </div>)}
            </div>
        </div>
    );
}
