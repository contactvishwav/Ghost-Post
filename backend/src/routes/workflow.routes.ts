import { Router } from 'express';
import { generateHooks, generatePost } from '../controllers/workflow.controller';

const router = Router();

// POST /api/workflow/hooks
router.post('/hooks', generateHooks);

// POST /api/workflow/post
router.post('/post', generatePost);

export default router;
