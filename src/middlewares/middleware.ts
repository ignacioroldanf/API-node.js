import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";

const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
console.log("DTO recibido:", req.body);
const output = plainToInstance(dtoClass, req.body, { enableImplicitConversion: true });
console.log("Instancia transformada:", output);
    const errors = await validate(output, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return res.status(400).json(formattedErrors);
    }
    next();
  };
};

export default validationMiddleware;
