using System;
using System.Collections.Generic;
using System.IO;

namespace SimpleBankingSystem
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
                Console.WriteLine("\n********* Simple Banking System *********");
                Console.WriteLine("1. Create Account");
                Console.WriteLine("2. Deposit Funds");
                Console.WriteLine("3. Withdraw Funds");
                Console.WriteLine("4. View Account Information");
                Console.WriteLine("5. Exit");
                Console.Write("Select an option (1-5): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            CreateAccount();
                            break;
                        case 2:
                            DepositFunds();
                            break;
                        case 3:
                            WithdrawFunds();
                            break;
                        case 4:
                            ViewAccountInformation();
                            break;
                        case 5:
                            SaveAccounts();
                            Environment.Exit(0);
                            break;
                        default:
                            Console.WriteLine("Invalid option. Please select a valid option (1-5).");
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
            Console.WriteLine("\n**** Create New Account ****");

            Console.Write("Enter Account Holder's Name: ");
            string name = Console.ReadLine();

            Console.Write("Enter Initial Deposit Amount: ");
            if (double.TryParse(Console.ReadLine(), out double initialDeposit) && initialDeposit >= 0)
            {
                Account newAccount = new Account(name, initialDeposit);
                accounts.Add(newAccount);

                Console.WriteLine("Account created successfully.");
            }
            else
            {
                Console.WriteLine("Invalid amount. Please enter a valid initial deposit amount.");
            }
        }

        static void DepositFunds()
        {
            Console.WriteLine("\n**** Deposit Funds ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.Write("Enter Deposit Amount: ");
                if (double.TryParse(Console.ReadLine(), out double depositAmount) && depositAmount >= 0)
                {
                    accounts[accountNumber].Deposit(depositAmount);
                    Console.WriteLine("Funds deposited successfully.");
                }
                else
                {
                    Console.WriteLine("Invalid amount. Please enter a valid deposit amount.");
                }
            }
        }

        static void WithdrawFunds()
        {
            Console.WriteLine("\n**** Withdraw Funds ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.Write("Enter Withdrawal Amount: ");
                if (double.TryParse(Console.ReadLine(), out double withdrawalAmount) && withdrawalAmount >= 0)
                {
                    if (accounts[accountNumber].Balance >= withdrawalAmount)
                    {
                        accounts[accountNumber].Withdraw(withdrawalAmount);
                        Console.WriteLine("Funds withdrawn successfully.");
                    }
                    else
                    {
                        Console.WriteLine("Insufficient balance. Cannot withdraw more than the account balance.");
                    }
                }
                else
                {
                    Console.WriteLine("Invalid amount. Please enter a valid withdrawal amount.");
                }
            }
        }

        static void ViewAccountInformation()
        {
            Console.WriteLine("\n**** View Account Information ****");
            int accountNumber = GetAccountNumber();

            if (accountNumber != -1)
            {
                Console.WriteLine(accounts[accountNumber].GetAccountInfo());
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
                        int.TryParse(accountInfo[0], out int accountNumber) &&
                        double.TryParse(accountInfo[2], out double balance))
                    {
                        accounts.Add(new Account(accountInfo[1], balance));
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
                accountData.Add($"{accounts.IndexOf(account) + 1},{account.AccountHolderName},{account.Balance}");
            }
            File.WriteAllLines(dataFilePath, accountData);
            Console.WriteLine("Accounts saved successfully.");
        }
    }

    class Account
    {
        public string AccountHolderName { get; private set; }
        public double Balance { get; private set; }

        public Account(string accountHolderName, double initialBalance)
        {
            AccountHolderName = accountHolderName;
            Balance = initialBalance;
        }

        public void Deposit(double amount)
        {
            Balance += amount;
        }

        public void Withdraw(double amount)
        {
            Balance -= amount;
        }

        public string GetAccountInfo()
        {
            return $"Account Holder's Name: {AccountHolderName}\nAccount Balance: {Balance:C}";
        }
    }
}
