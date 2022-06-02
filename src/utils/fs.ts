import path from 'path'
import { readdir } from 'fs/promises'
import * as fs from 'fs/promises'
import { BankAccountEvent, IBankAccount, IBankAccountUserFile } from '../types'

export async function readDir(): Promise<Array<string> | undefined> {
  try {
    const filepath: string = path.join(
      __dirname,
      '../../events'
    )
    return await readdir(`${filepath}`);
  } catch (err) {
    console.log(err)
  }
}

export async function loadFilesData(accountId: string): Promise<BankAccountEvent[] | any> {
  try {
    let events: Array<BankAccountEvent> = [];
    const filepath: string = path.join(
      __dirname,
      '../../events'
    )
    const files: Array<string> = await readdir(`${filepath}/${accountId}`);
    for (const file of files) {
      let data: string = await fs.readFile(`${filepath}/${accountId}/${file}`, { encoding: 'utf8' })
      events.push(JSON.parse(data))
    }
    return events;
  } catch (err) {
    console.log(err)
  }
}

export async function searchNameFile(accountId: string): Promise<IBankAccountUserFile | undefined> {
  try {
    const filepath: string = path.join(
      __dirname,
      '../../events'
    )
    const files: Array<string> = await readdir(`${filepath}/${accountId}`);
    for (const file of files) {
      let fileData: string = await fs.readFile(`${filepath}/${accountId}/${file}`, { encoding: 'utf8' })
      let data: IBankAccountUserFile = JSON.parse(fileData);
      if (data.ownerName) return data
    }
  } catch (err) {
      console.log(err)
  }
}