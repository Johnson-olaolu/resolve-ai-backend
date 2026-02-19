import { isBcryptHash } from 'src/utils/misc';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import { RegistrationTypeEnum, USER_ROLES } from 'src/utils/constants';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', default: RegistrationTypeEnum.EMAIL })
  registrationType: RegistrationTypeEnum;

  @Exclude()
  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  forceChangePassword: boolean;

  @Column({ type: 'text', nullable: true })
  role: USER_ROLES;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      if (!isBcryptHash(this.password)) {
        this.password = await bcrypt.hash(this.password, 3); // You can adjust the salt rounds as needed
      }
    }
  }

  async comparePasswords(password: string) {
    const result = await bcrypt.compare(password, this.password);
    return result;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
