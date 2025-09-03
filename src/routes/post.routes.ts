import express from 'express';
import { getAllPosts, createPost } from '../services/post.service';
import { postValidation } from '../validators/post.validator';
import { validationResult } from 'express-validator';

const router = express.Router();


router.get('/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Greška prilikom dohvaćanja objava.' });
    }
});

router.post('/posts', postValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const newPost = await createPost(req.body);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: 'Greška prilikom kreiranja objave.' });
    }
});

export default router;
