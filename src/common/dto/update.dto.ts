import { PartialType } from '@nestjs/swagger';
import { CreateDto } from './create.dto';

export class UpdateDTO extends PartialType(CreateDto) {}
