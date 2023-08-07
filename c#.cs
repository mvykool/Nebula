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

using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace NoteTakingApp
{
    public partial class MainForm : Form
    {
        private List<string> notes = new List<string>();

        public MainForm()
        {
            InitializeComponent();
        }

        private void addButton_Click(object sender, EventArgs e)
        {
            string note = noteTextBox.Text;
            if (!string.IsNullOrWhiteSpace(note))
            {
                notes.Add(note);
                noteTextBox.Clear();
                MessageBox.Show("Note added successfully!", "Note Taking App", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void viewButton_Click(object sender, EventArgs e)
        {
            if (notes.Count == 0)
            {
                MessageBox.Show("No notes to display.", "Note Taking App", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            string notesText = string.Join("\n", notes);
            MessageBox.Show(notesText, "Your Notes", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }

    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }
}

using System;
using System.Collections.Generic;

class Product
{
    public string Name { get; set; }
    public double Price { get; set; }

    public Product(string name, double price)
    {
        Name = name;
        Price = price;
    }
}

class ShoppingCart
{
    private List<Product> items = new List<Product>();

    public void AddItem(Product product)
    {
        items.Add(product);
    }

    public double CalculateTotal()
    {
        double total = 0;
        foreach (Product item in items)
        {
            total += item.Price;
        }
        return total;
    }
}

class Program
{
    static void Main(string[] args)
    {
        ShoppingCart cart = new ShoppingCart();

        Product apple = new Product("Apple", 0.5);
        Product banana = new Product("Banana", 0.3);
        Product laptop = new Product("Laptop", 1000.0);

        cart.AddItem(apple);
        cart.AddItem(banana);
        cart.AddItem(laptop);

        Console.WriteLine("Items added to cart:");
        foreach (Product item in cart.Items)
        {
            Console.WriteLine($"{item.Name} - ${item.Price}");
        }

        double total = cart.CalculateTotal();
        Console.WriteLine($"Total: ${total}");
    }
}
