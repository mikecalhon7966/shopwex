import express from 'express';
import { getPostBySearch,getPost,getPostById,createPost,updatePost,deletePost,likePost,commentPost } from '../controllers/post.controller.js';
import auth from '../middleware/Auth.middleware.js'

const router = express.Router();

router.get('/',getPost);
router.get('/search',getPostBySearch);
router.get('/:id',getPostById);
router.post('/',auth,createPost);
router.patch('/:id',auth,updatePost);
router.delete('/:id',auth,deletePost)
router.patch('/:id/likePost',auth,likePost);
router.post('/:id/commentPost',auth,commentPost);
export default router;