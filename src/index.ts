// Import required modules
import express, { Request, Response } from 'express'; // Express framework and types
import cors from "cors"; // CORS middleware
import { UserService } from './User/UserService'; // User service for handling user logic
import { PostService } from './Posts/PostService';

// Create Express app instance
const app = express();

// Set server port (default to 3000 if not specified)
const PORT = process.env.PORT || 3000;

// CORS configuration to allow requests from specific origins and methods
const corsOptions = {
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: 'GET,POST,DELETE,PUT',
  allowedHeaders: ['Content-Type', 'Authorization']
};



// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS with specified options
app.use(cors(corsOptions));


// Root route for basic server check
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Node.js!');
});


// Instantiate the user service
const User = new UserService();

// User management routes
app.get('/users', User.getAllUsers); // Get all users
app.post('/users/create', User.createUser); // Create a new user
app.put('/user/:id', User.updateUser); // Update user by ID
app.get('/user/:id', User.getUserById); // Get user by ID
app.delete('/user/:id', User.deleteUser); // Delete user by ID

const Post = new PostService();
app.get('/posts', Post.getAllPosts);
app.post('/posts/create', Post.createPost); // Create a new post
app.put('/post/:id', Post.updatePost); // Update post by ID
app.get('/post/:id', Post.getPostById); // Get post by ID
app.delete('/post/:id', Post.deletePost); // Delete post by ID

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






