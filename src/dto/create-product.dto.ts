import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsInt
} from "class-validator";
import { Type } from "class-transformer";
import Product from "../models/productModel";

@ValidatorConstraint({ async: true })
export class IsNameUnique implements ValidatorConstraintInterface {
  async validate(value: string, args?: ValidationArguments) {
    if (!value) return false; // si viene undefined, falla
    const product = await Product.findOne({ name: value });
    return !product;
  }

  defaultMessage(args?: ValidationArguments) {
    return "El nombre del producto ya existe. Por favor, elige otro nombre.";
  }
}

export class CreateProductDto {
  @IsString({ message: "El nombre debe tener un texto" })
  @MinLength(5, { message: "El nombre debe tener al menos 5 caracteres" })
  @MaxLength(20, { message: "El nombre debe tener 20 caracteres como máximo" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @Validate(IsNameUnique)
  name!: string;

  @IsInt()
  @Min(0, { message: "El precio mínimo es 0" })
  @IsNotEmpty({ message: "El precio es obligatorio" })
  price!: number;

  @IsInt()
  @Min(0, { message: "El stock mínimo es 0" })
  @IsNotEmpty({ message: "El stock es obligatorio" })
  stock!: number;

  @IsString({ message: "La descripción debe ser un texto" })
  @IsOptional()
  description?: string;
}
