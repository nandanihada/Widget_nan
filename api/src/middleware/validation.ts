import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  createProject: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional()
  }),

  updateProject: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional(),
    questions: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        text: Joi.string().required(),
        type: Joi.string().valid('multiple-choice', 'text', 'rating', 'boolean').required(),
        options: Joi.array().items(Joi.string()).optional(),
        required: Joi.boolean().default(false),
        order: Joi.number().required()
      })
    ).optional(),
    settings: Joi.object({
      theme: Joi.object({
        primaryColor: Joi.string().optional(),
        secondaryColor: Joi.string().optional(),
        backgroundColor: Joi.string().optional(),
        textColor: Joi.string().optional(),
        borderRadius: Joi.string().optional()
      }).optional(),
      branding: Joi.object({
        showPoweredBy: Joi.boolean().optional(),
        customLogo: Joi.string().optional()
      }).optional(),
      behavior: Joi.object({
        autoSubmit: Joi.boolean().optional(),
        showProgressBar: Joi.boolean().optional(),
        allowBack: Joi.boolean().optional()
      }).optional()
    }).optional()
  }),

  submitResponse: Joi.object({
    responses: Joi.object().required()
  })
};
