import { IAccountModel } from '../models/account'

export interface IAddAccount {
  add: (account: IAddAccountModel) => IAccountModel
}

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}
