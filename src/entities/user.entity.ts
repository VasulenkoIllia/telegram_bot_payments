import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Role } from '../common/interfaces/user/role.enum';

@Entity('user')
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'varchar', length: 300 })
  @AutoMap()
  public login: string;

  @Column({ type: 'varchar', length: 128 })
  public password: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created: string;

  @Column({ enum: Role })
  role: Role;
}
