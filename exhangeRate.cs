using System;

namespace CurrencyConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            double exchangeRate = 0.85;

            Console.WriteLine("USD to Euros Currency Converter");
            Console.WriteLine($"1 USD = {exchangeRate} Euros\n");

            while (true)
            {
                Console.WriteLine("Enter the amount in USD:");
                double usdAmount = GetAmountFromUser();

                double eurosAmount = ConvertToEuros(usdAmount, exchangeRate);

                Console.WriteLine($"Equivalent amount in Euros: {eurosAmount} Euros\n");

                Console.WriteLine("Do you want to convert another amount? (Y/N)");
                string continueChoice = Console.ReadLine();

                if (!string.Equals(continueChoice, "Y", StringComparison.OrdinalIgnoreCase))
                    break;
            }
        }

        static double GetAmountFromUser()
        {
            while (true)
            {
                if (double.TryParse(Console.ReadLine(), out double amount))
                    return amount;

                Console.WriteLine("Invalid input. Please enter a valid number:");
            }
        }

        static double ConvertToEuros(double usdAmount, double exchangeRate)
        {
            return usdAmount * exchangeRate;
        }
    }
}
