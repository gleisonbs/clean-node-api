import { IAccountModel, IAddAccount, IAddAccountModel, IHasher, IAddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, ...{ password: hashedPassword } })
    return await new Promise(resolve => resolve(account))
  }
}
