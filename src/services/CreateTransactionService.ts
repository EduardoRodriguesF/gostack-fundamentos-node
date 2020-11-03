import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  private balance: Balance;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
    this.balance = transactionsRepository.getBalance();
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type === 'outcome') {
      if (value > this.balance.total) {
        throw Error('Insufficiente balance');
      }
      this.balance.outcome += value;
    } else {
      this.balance.income += value;
    }

    this.balance.total = this.balance.income - this.balance.outcome;

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
