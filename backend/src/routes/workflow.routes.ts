import { Router } from 'express';
import { generateHooks, generatePost, generateVariations, saveWorkflowSession, publishWorkflow } from '../controllers/workflow.controller';

const router = Router();

// POST /api/workflow/hooks
router.post('/hooks', generateHooks);

// POST /api/workflow/post
router.post('/post', generatePost);

// POST /api/workflow/variations
router.post('/variations', generateVariations);

// POST /api/workflow/save
router.post('/save', saveWorkflowSession);

// POST /api/workflow/publish
router.post('/publish', publishWorkflow);

export default router;
