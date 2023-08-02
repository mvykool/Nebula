using System;
using System.Collections.Generic;
using System.IO;

namespace BankyBank
{
    class Program
    {
        static List<Account> accounts = new List<Account>();
        const string dataFilePath = "accounts.txt";

        static void Main(string[] args)
        {
            LoadAccounts();

            while (true)
            {
                Console.WriteLine("\n********* Banky Bank *********");
                Console.WriteLine("1. Create Account");
                Console.WriteLine("2. Deposit Money");
                Console.WriteLine("3. Withdraw Money");
                Console.WriteLine("4. Check Account Balance");
                Console.WriteLine("5. View Transaction History");
                Console.WriteLine("6. Exit");
                Console.Write("Select an option (1-6): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            CreateAccount();
                            break;
                        case 2:
                            DepositMoney();
                            break;
                        case 3:
                            WithdrawMoney();
                            break;
                        case 4:
                            CheckAccountBalance();
                            break;
                        case 5:
                            ViewTransactionHistory();
                            break;
                        case 6:
                            SaveAccounts();
                            Environment.Exit(0);
                            break;
                        default:
                            Console.WriteLine("Invalid option. Please select a valid option (1-6).");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("Invalid input. Please enter a valid number.");
                }
            }
        }

        static void CreateAccount()
        {
            Console.WriteLine("\n**** Create Account ****");

            Console.Write("Enter Account Holder's Name: ");
            string accountHolderName = Console.ReadLine();

            Console.Write("Enter Initial Deposit Amount: ");
            if (decimal.TryParse(Console.ReadLine(), out decimal initialBalance) && initialBalance >= 0)
            {
                Account newAccount = new Account(accountHolderName, initialBalance);
                accounts.Add(newAccount);
                Console.WriteLine($"Account created successfully. Account Number: {newAccount.AccountNumber}");
            }
            else
            {
                Console.WriteLine("Invalid initial deposit amount. Please enter a valid amount.");
            }
        }

        static void DepositMoney()
        {
            Console.WriteLine("\n**** Deposit Money ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.Write("Enter Deposit Amount: ");
                if (decimal.TryParse(Console.ReadLine(), out decimal depositAmount) && depositAmount > 0)
                {
                    accounts[accountNumber].Deposit(depositAmount);
                    Console.WriteLine("Deposit successful.");
                }
                else
                {
                    Console.WriteLine("Invalid deposit amount. Please enter a valid amount.");
                }
            }
        }

        static void WithdrawMoney()
        {
            Console.WriteLine("\n**** Withdraw Money ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.Write("Enter Withdrawal Amount: ");
                if (decimal.TryParse(Console.ReadLine(), out decimal withdrawalAmount) && withdrawalAmount > 0)
                {
                    if (accounts[accountNumber].Withdraw(withdrawalAmount))
                    {
                        Console.WriteLine("Withdrawal successful.");
                    }
                    else
                    {
                        Console.WriteLine("Insufficient balance. Withdrawal canceled.");
                    }
                }
                else
                {
                    Console.WriteLine("Invalid withdrawal amount. Please enter a valid amount.");
                }
            }
        }

        static void CheckAccountBalance()
        {
            Console.WriteLine("\n**** Check Account Balance ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.WriteLine($"Account Holder: {accounts[accountNumber].AccountHolderName}");
                Console.WriteLine($"Account Balance: {accounts[accountNumber].Balance}");
            }
        }

        static void ViewTransactionHistory()
        {
            Console.WriteLine("\n**** Transaction History ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.WriteLine($"Account Holder: {accounts[accountNumber].AccountHolderName}");
                Console.WriteLine("Transaction History:");
                foreach (Transaction transaction in accounts[accountNumber].TransactionHistory)
                {
                    Console.WriteLine($"{transaction.TransactionType} - Amount: {transaction.Amount}, Date: {transaction.TransactionDate}");
                }
            }
        }

        static int GetAccountNumber()
        {
            Console.Write("Enter Account Number: ");
            if (int.TryParse(Console.ReadLine(), out int accountNumber) && accountNumber > 0 && accountNumber <= accounts.Count)
            {
                return accountNumber - 1; // Subtracting 1 to get the correct index in the list
            }
            else
            {
                Console.WriteLine("Invalid account number. Please enter a valid account number.");
                return -1;
            }
        }

        static void LoadAccounts()
        {
            if (File.Exists(dataFilePath))
            {
                string[] accountData = File.ReadAllLines(dataFilePath);
                foreach (string data in accountData)
                {
                    string[] accountInfo = data.Split(',');
                    if (accountInfo.Length == 3 &&
                        decimal.TryParse(accountInfo[1], out decimal balance))
                    {
                        int accountNumber = int.Parse(accountInfo[0]);
                        Account newAccount = new Account(accountNumber, accountInfo[2], balance);
                        accounts.Add(newAccount);
                    }
                }
                Console.WriteLine("Accounts loaded successfully.");
            }
        }

        static void SaveAccounts()
        {
            List<string> accountData = new List<string>();
            foreach (Account account in accounts)
            {
                accountData.Add($"{account.AccountNumber},{account.Balance},{account.AccountHolderName}");
            }
            File.WriteAllLines(dataFilePath, accountData);
            Console.WriteLine("Accounts saved successfully.");
        }
    }

    class Account
    {
        private static int nextAccountNumber = 1;

        public int AccountNumber { get; private set; }
        public string AccountHolderName { get; set; }
        public decimal Balance { get; private set; }
        public List<Transaction> TransactionHistory { get; private set; }

        public Account(string accountHolderName, decimal initialBalance)
        {
            AccountNumber = nextAccountNumber++;
            AccountHolderName = accountHolderName;
            Balance = initialBalance;
            TransactionHistory = new List<Transaction>();
        }

        public Account(int accountNumber, string accountHolderName, decimal balance)
        {
            AccountNumber = accountNumber;
            AccountHolderName = accountHolderName;
            Balance = balance;
            TransactionHistory = new List<Transaction>();
        }

        public void Deposit(decimal amount)
        {
            Balance += amount;
            TransactionHistory.Add(new Transaction("Deposit", amount));
        }

        public bool Withdraw(decimal amount)
        {
            if (Balance >= amount)
            {
                Balance -= amount;
                TransactionHistory.Add(new Transaction("Withdrawal", amount));
                return true;
            }
            return false;
        }
    }

    class Transaction
    {
        public string TransactionType { get; private set; }
        public decimal Amount { get; private set; }
        public DateTime TransactionDate { get; private set; }

        public Transaction(string transactionType, decimal amount)
        {
            TransactionType = transactionType;
            Amount = amount;
            TransactionDate = DateTime.Now;
        }
    }
}
