import {
  BankAccountEvent, BankAccountEventBase,
  IBankAccount, IBankAccountTransaction,
  IMoneyCreditedEventBase,
  IMoneyDebitedEventBase
} from '../types'

export function translatorType(type: string): string {
  let translations: any = {
    'MoneyCredited': 'credit',
    'MoneyDebited': 'debit',
  }
  return translations[type];
}

export function updateBalance(arr: Array<IMoneyDebitedEventBase | IMoneyCreditedEventBase>, balance: number): number {
  for(let i = 0; i < arr.length; i++) {
    if (arr[i].type === 'MoneyDebited') {
      balance += arr[i].value
    } else if (arr[i].type === 'MoneyCredited') {
      balance -= arr[i].value
    }
  }
  return balance;
}

export function sort(arr: Array<any>, type: string = 'AccountOpened'): IBankAccount | Array<IBankAccountTransaction> | any {
  console.log(arr)
  if(arr.length > 0) {
    let arrUpdated: Array<IBankAccountTransaction> = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i]?.type === type) {
        if (type == 'AccountOpened') {
          return {
            status: 'open',
            accountId: arr[i].accountId,
            ownerName: arr[i].ownerName,
            balance: 0,
            openedAt: Date.parse(arr[i].time),
            isOverdrawn: false,
            transactions: [],
          }
        } else {
          arrUpdated.push({
            type: translatorType(arr[i].type),
            value: arr[i].value,
            timestamp: Date.parse(arr[i].time)
          });
        }
      }
    }
    if (type == 'AccountOpened') {
      arrUpdated.sort((x, y) => {
        return x.timestamp - y.timestamp;
      })
    }
    return arrUpdated;
  }
  else return;
}