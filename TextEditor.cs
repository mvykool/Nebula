using System;
using System.IO;

namespace TextEditorX
{
    class Program
    {
        static string currentFilePath = null;
        static string fileContent = "";

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to TextEditorX!");

            while (true)
            {
                Console.WriteLine("\n********* Text Editor *********");
                Console.WriteLine("1. New File");
                Console.WriteLine("2. Open File");
                Console.WriteLine("3. Save File");
                Console.WriteLine("4. Save As");
                Console.WriteLine("5. Edit Text");
                Console.WriteLine("6. Copy Text");
                Console.WriteLine("7. Cut Text");
                Console.WriteLine("8. Paste Text");
                Console.WriteLine("9. Exit");
                Console.Write("Select an option (1-9): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            NewFile();
                            break;
                        case 2:
                            OpenFile();
                            break;
                        case 3:
                            SaveFile();
                            break;
                        case 4:
                            SaveFileAs();
                            break;
                        case 5:
                            EditText();
                            break;
                        case 6:
                            CopyText();
                            break;
                        case 7:
                            CutText();
                            break;
                        case 8:
                            PasteText();
                            break;
                        case 9:
                            Exit();
                            break;
                        default:
                            Console.WriteLine("Invalid option. Please select a valid option (1-9).");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("Invalid input. Please enter a valid number.");
                }
            }
        }

        static void NewFile()
        {
            Console.Write("Enter file name (without extension): ");
            string fileName = Console.ReadLine();

            if (!string.IsNullOrWhiteSpace(fileName))
            {
                currentFilePath = fileName + ".txt";
                fileContent = "";
                Console.WriteLine($"New file '{currentFilePath}' created.");
            }
            else
            {
                Console.WriteLine("Invalid file name. Please enter a valid name.");
            }
        }

        static void OpenFile()
        {
            Console.Write("Enter file name (including extension): ");
            string fileName = Console.ReadLine();

            if (File.Exists(fileName))
            {
                currentFilePath = fileName;
                fileContent = File.ReadAllText(fileName);
                Console.WriteLine($"File '{currentFilePath}' opened.");
            }
            else
            {
                Console.WriteLine("File not found. Please enter a valid file name.");
            }
        }

        static void SaveFile()
        {
            if (!string.IsNullOrWhiteSpace(currentFilePath))
            {
                File.WriteAllText(currentFilePath, fileContent);
                Console.WriteLine($"File '{currentFilePath}' saved.");
            }
            else
            {
                SaveFileAs();
            }
        }

        static void SaveFileAs()
        {
            Console.Write("Enter new file name (including extension): ");
            string newFileName = Console.ReadLine();

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                File.WriteAllText(newFileName, fileContent);
                currentFilePath = newFileName;
                Console.WriteLine($"File '{currentFilePath}' saved.");
            }
            else
            {
                Console.WriteLine("Invalid file name. Please enter a valid name.");
            }
        }

        static void EditText()
        {
            if (!string.IsNullOrWhiteSpace(currentFilePath))
            {
                Console.WriteLine("Enter the text (Press 'Ctrl+Z' followed by 'Enter' to finish editing):");
                fileContent = Console.ReadLine();
                Console.WriteLine("Text edited.");
            }
            else
            {
                Console.WriteLine("Please open or create a file first.");
            }
        }

        static void CopyText()
        {
            if (!string.IsNullOrWhiteSpace(fileContent))
            {
                Console.WriteLine("Text copied.");
                Clipboard.Copy(fileContent);
            }
            else
            {
                Console.WriteLine("Nothing to copy. Please enter some text first.");
            }
        }

        static void CutText()
        {
            if (!string.IsNullOrWhiteSpace(fileContent))
            {
                Console.WriteLine("Text cut.");
                Clipboard.Copy(fileContent);
                fileContent = "";
            }
            else
            {
                Console.WriteLine("Nothing to cut. Please enter some text first.");
            }
        }

        static void PasteText()
        {
            string clipboardText = Clipboard.Get();
            if (!string.IsNullOrWhiteSpace(clipboardText))
            {
                fileContent += clipboardText;
                Console.WriteLine("Text pasted.");
            }
            else
            {
                Console.WriteLine("Clipboard is empty. Nothing to paste.");
            }
        }

        static void Exit()
        {
            if (!string.IsNullOrWhiteSpace(fileContent))
            {
                Console.WriteLine("Warning: You have unsaved changes. Do you want to save before exiting? (Y/N)");
                string response = Console.ReadLine().ToLower();

                if (response == "y")
                {
                    SaveFile();
                }
            }

            Console.WriteLine("Goodbye!");
            Environment.Exit(0);
        }
    }

    static class Clipboard
    {
        private static string copiedText = "";

        public static void Copy(string text)
        {
            copiedText = text;
        }

        public static string Get()
        {
            return copiedText;
        }
    }
}


using System;

namespace HelloWorldApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}

using System;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to the C# Console App!");
            Console.Write("Please enter your name: ");
            string name = Console.ReadLine();

            Console.WriteLine($"Hello, {name}!");

            Console.WriteLine("Let's do a simple calculation.");
            Console.Write("Enter a number: ");
            double num1 = Convert.ToDouble(Console.ReadLine());

            Console.Write("Enter another number: ");
            double num2 = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine($"Sum: {num1 + num2}");
            Console.WriteLine($"Difference: {num1 - num2}");
            Console.WriteLine($"Product: {num1 * num2}");
            Console.WriteLine($"Quotient: {num1 / num2}");

            Console.WriteLine("Now, let's count from 1 to 10:");
            for (int i = 1; i <= 10; i++)
            {
                Console.Write($"{i} ");
            }
            Console.WriteLine();

            Console.WriteLine("Let's check if a number is even or odd.");
            Console.Write("Enter a number: ");
            int number = Convert.ToInt32(Console.ReadLine());

            if (number % 2 == 0)
            {
                Console.WriteLine($"{number} is even.");
            }
            else
            {
                Console.WriteLine($"{number} is odd.");
            }

            Console.WriteLine("Thanks for using the console app!");
        }
    }
}
