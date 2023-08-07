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

using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        List<string> notes = new List<string>();

        while (true)
        {
            Console.WriteLine("Note Taking App");
            Console.WriteLine("1. Add a note");
            Console.WriteLine("2. View notes");
            Console.WriteLine("3. Exit");

            Console.Write("Enter your choice: ");
            int choice = Convert.ToInt32(Console.ReadLine());

            switch (choice)
            {
                case 1:
                    Console.Write("Enter your note: ");
                    string note = Console.ReadLine();
                    notes.Add(note);
                    Console.WriteLine("Note added successfully!\n");
                    break;
                case 2:
                    Console.WriteLine("Your notes:");
                    for (int i = 0; i < notes.Count; i++)
                    {
                        Console.WriteLine($"{i + 1}. {notes[i]}");
                    }
                    Console.WriteLine();
                    break;
                case 3:
                    Console.WriteLine("Exiting the app.");
                    return;
                default:
                    Console.WriteLine("Invalid choice. Please try again.\n");
                    break;
            }
        }
    }
}


