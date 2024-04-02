import { ApiProperty } from '@nestjs/swagger';

export class CourseSummaryDto {
  @ApiProperty()
  major: string;

  @ApiProperty()
  enrollment: number;
}
