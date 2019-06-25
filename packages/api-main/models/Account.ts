import {
  Table,
  Column,
  Model,
  Unique,
  PrimaryKey,
  DataType,
  Default,
} from 'sequelize-typescript'

@Table({
  tableName: 'accounts',
})
export class Account extends Model<Account> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  @Column
  @PrimaryKey
  id!: number

  @Column({
    type: DataType.STRING(255),
  })
  @Unique
  name!: string

  @Column
  passwordHash!: Buffer

  @Column
  @Default(0)
  permissionMask?: number
}
