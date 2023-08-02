using System;

namespace SimpleCalculator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to Simple Calculator!");

            while (true)
            {
                Console.WriteLine("Enter the first number:");
                double num1 = GetNumberFromUser();

                Console.WriteLine("Enter the operator (+, -, *, /):");
                char op = GetOperatorFromUser();

                Console.WriteLine("Enter the second number:");
                double num2 = GetNumberFromUser();

                double result = PerformCalculation(num1, num2, op);

                Console.WriteLine($"Result: {result}\n");

                Console.WriteLine("Do you want to perform another calculation? (Y/N)");
                string continueChoice = Console.ReadLine();

                if (!string.Equals(continueChoice, "Y", StringComparison.OrdinalIgnoreCase))
                    break;
            }
        }

        static double GetNumberFromUser()
        {
            while (true)
            {
                if (double.TryParse(Console.ReadLine(), out double num))
                    return num;

                Console.WriteLine("Invalid input. Please enter a valid number:");
            }
        }

        static char GetOperatorFromUser()
        {
            while (true)
            {
                char op = Console.ReadKey().KeyChar;
                if (op == '+' || op == '-' || op == '*' || op == '/')
                    return op;

                Console.WriteLine("\nInvalid operator. Please enter a valid operator (+, -, *, /):");
            }
        }

        static double PerformCalculation(double num1, double num2, char op)
        {
            switch (op)
            {
                case '+':
                    return num1 + num2;
                case '-':
                    return num1 - num2;
                case '*':
                    return num1 * num2;
                case '/':
                    if (num2 != 0)
                        return num1 / num2;
                    else
                        Console.WriteLine("Error: Division by zero is not allowed.");
                    break;
            }

            return 0;
        }
    }
}
