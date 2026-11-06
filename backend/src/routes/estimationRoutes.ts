import express, { Request, Response } from 'express';
import { estimationService } from '../services/estimationService';

const router = express.Router();

/**
 * POST /api/estimations
 * Create a new estimation
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const estimation = await estimationService.createEstimation(req.body);
    res.status(201).json({
      success: true,
      data: estimation,
      message: 'Estimation created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/estimations/:id
 * Get a specific estimation
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const estimation = await estimationService.getEstimation(req.params.id);
    if (!estimation) {
      return res.status(404).json({
        success: false,
        error: 'Estimation not found',
      });
    }
    res.json({
      success: true,
      data: estimation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/estimations
 * Get all estimations
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 10;

    const estimations = await estimationService.getEstimations(skip, take);
    res.json({
      success: true,
      data: estimations,
      pagination: { skip, take },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * PUT /api/estimations/:id
 * Update an estimation
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const estimation = await estimationService.updateEstimation(req.params.id, req.body);
    res.json({
      success: true,
      data: estimation,
      message: 'Estimation updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

/**
 * DELETE /api/estimations/:id
 * Delete an estimation
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await estimationService.deleteEstimation(req.params.id);
    res.json({
      success: true,
      message: 'Estimation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;