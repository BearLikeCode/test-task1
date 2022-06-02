import fs from 'fs/promises'
import path from 'path'
import type { BankAccountEventBase } from '../types'
import { loadFilesData, searchNameFile } from '../utils/fs'
import { sort, updateBalance } from '../utils/accountState'
import { BankAccountEvent, IBankAccount, IBankAccountTransaction, IBankAccountUserFile } from '../types'

/**
 * Load events for the given `accountId`.
 *
 * TODO: Implement this function. This is part of the test.
 *
 * The implementation should return a promise that resolves to an array
 * of objects, sourced from the relevant directory inside of the "events"
 * directory at the root of this project.
 *
 * @see saveEvents
 */
export async function loadEvents(
  accountId: string
): Promise<BankAccountEventBase[] | undefined> {
  try {
    let events: Array<any> = [];

    events = await loadFilesData(accountId)

    let computedAccountState: any = sort(events);
    if(computedAccountState != undefined)
      computedAccountState.balance = updateBalance(events, computedAccountState?.balance)

    if (computedAccountState.balance < 0) computedAccountState.isOverdrawn = true;

    let debits: IBankAccountTransaction[] = sort(events, 'MoneyDebited');
    let credits: IBankAccountTransaction[] = sort(events, 'MoneyCredited');

    computedAccountState.transactions = [...debits, ...credits]
    return computedAccountState;
  } catch (err) {
    console.error(err);
  }
}


/**
 * Saves new events.
 */
export async function saveEvents(name: string, accountId: string): Promise<void> {
  const data: IBankAccountUserFile | undefined = await searchNameFile(accountId)
  const filepath: string = path.join(
    __dirname,
    '../../events',
    accountId,
    `${data?.position}.json`
  )
  if (data != undefined) data.ownerName = name;
  await fs.writeFile(filepath, JSON.stringify(data, null, 2))
}
