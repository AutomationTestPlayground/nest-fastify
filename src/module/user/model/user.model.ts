import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
  IsDateString,
  IsDecimal,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as argon2 from 'argon2';

import { appConfig } from '@config';
import { UserRole, Code } from '@model';
import { Example, OnlyUpdateGroup, Base } from '@shared';

@Entity()
export class User extends Base {
  @Column()
  @ApiProperty({ example: faker.person.fullName(), description: '' })
  @IsString()
  readonly name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: faker.image.url(), description: '' })
  @IsString()
  @IsOptional()
  avatar?: string;
  @BeforeInsert()
  @BeforeUpdate()
  beforeAvatar?(): void {
    if (this.avatar && this.avatar.indexOf(appConfig.URL_FILE) === 0)
      this.avatar = this.avatar.replace(appConfig.URL_FILE, '');
  }
  @AfterLoad()
  afterAvatar?(): void {
    if (this.avatar && this.avatar.indexOf('http') === -1) this.avatar = appConfig.URL_FILE + this.avatar;
  }

  @Column()
  @Expose({ groups: [OnlyUpdateGroup] })
  @ApiProperty({ example: Example.password, description: '' })
  @MinLength(6)
  @MaxLength(59)
  @IsOptional()
  password?: string;
  @BeforeInsert()
  @BeforeUpdate()
  async beforePassword?(): Promise<void> {
    if (this.password && this.password.length < 60) {
      this.password = this.password && (await argon2.hash(this.password));
    }
  }

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;
  @BeforeUpdate()
  async beforeRefreshToken?(): Promise<void> {
    this.refreshToken = this.refreshToken && (await argon2.hash(this.refreshToken));
  }

  @Column({ nullable: true })
  @Exclude()
  resetPasswordToken?: string;

  @Column()
  @ApiProperty({ example: faker.internet.email().toLowerCase(), description: '' })
  @IsEmail()
  readonly email: string;

  @Column()
  @ApiProperty({ example: faker.phone.number('0#########'), description: '' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  readonly phoneNumber: string;

  @Column()
  @ApiProperty({ example: faker.date.birthdate(), description: '' })
  @IsDateString()
  dob: Date;

  @Column({ nullable: true })
  @Expose()
  @ApiProperty({ example: faker.lorem.paragraph(), description: '' })
  @IsString()
  @IsOptional()
  description: string;

  @Column({ nullable: true })
  @Expose()
  @IsString()
  @IsOptional()
  roleCode?: string;

  @ManyToOne(() => UserRole, (role) => role.users, { eager: true }) //
  @JoinColumn({ name: 'roleCode', referencedColumnName: 'code' })
  @Type(() => UserRole)
  readonly role?: UserRole;

  @Column({ nullable: true })
  @Expose()
  @ApiProperty({ example: 'DEV', description: '' })
  @IsString()
  @IsOptional()
  readonly positionCode?: string;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'positionCode', referencedColumnName: 'code' })
  readonly position?: Code;

  @Column()
  @ApiProperty({ example: faker.date.past(), description: '' })
  @IsDateString()
  startDate?: Date;

  @Column({ nullable: true, type: 'real' })
  @ApiProperty({ example: faker.number.int({ min: 0.5, max: 12 }), description: '' })
  @IsNumber()
  @IsOptional()
  dateLeave?: number;

  @Column({ nullable: true, type: 'real', default: 0 })
  @Expose()
  @ApiProperty({ example: faker.number.int({ min: 0.5, max: 12 }), description: '' })
  @IsDecimal()
  readonly dateOff: number;
}