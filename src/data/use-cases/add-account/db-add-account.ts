import { IAccountModel, IAddAccount, IAddAccountModel, IHasher, IAddAccountRepository, ILoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: IAddAccountModel): Promise<IAccountModel | null> {
    const account = await this.loadAccountByEmailRepositoryStub.loadByEmail(accountData.email)
    if (account) {
      return null
    }

    const hashedPassword = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add({ ...accountData, ...{ password: hashedPassword } })
    return await new Promise(resolve => resolve(newAccount))
  }
}
