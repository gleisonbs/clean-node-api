import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { IAddAccountModel } from '../../../../domain/use-cases/add-account'
import { IAccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const { _id, ...account } = result.ops[0]
    account.id = _id

    return account
  }
}
