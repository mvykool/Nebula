using System;
using System.Collections.Generic;

namespace StoreInventoryManager
{
    class Program
    {
        static List<Product> products = new List<Product>();

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to StoreInventoryManager!");

            while (true)
            {
                Console.WriteLine("\n********* Inventory Manager *********");
                Console.WriteLine("1. Add Product");
                Console.WriteLine("2. View All Products");
                Console.WriteLine("3. Update Product Information");
                Console.WriteLine("4. Check Product Availability");
                Console.WriteLine("5. Remove Product");
                Console.WriteLine("6. Exit");
                Console.Write("Select an option (1-6): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            AddProduct();
                            break;
                        case 2:
                            ViewAllProducts();
                            break;
                        case 3:
                            UpdateProductInformation();
                            break;
                        case 4:
                            CheckProductAvailability();
                            break;
                        case 5:
                            RemoveProduct();
                            break;
                        case 6:
                            Exit();
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

        static void AddProduct()
        {
            Console.WriteLine("\n**** Add Product ****");

            Console.Write("Enter Product Name: ");
            string name = Console.ReadLine();

            Console.Write("Enter Product Price: ");
            if (decimal.TryParse(Console.ReadLine(), out decimal price) && price >= 0)
            {
                Console.Write("Enter Product Quantity: ");
                if (int.TryParse(Console.ReadLine(), out int quantity) && quantity >= 0)
                {
                    Product newProduct = new Product(name, price, quantity);
                    products.Add(newProduct);
                    Console.WriteLine($"Product '{name}' added successfully.");
                }
                else
                {
                    Console.WriteLine("Invalid quantity. Please enter a valid non-negative quantity.");
                }
            }
            else
            {
                Console.WriteLine("Invalid price. Please enter a valid non-negative price.");
            }
        }

        static void ViewAllProducts()
        {
            Console.WriteLine("\n**** All Products ****");
            foreach (Product product in products)
            {
                Console.WriteLine($"Product Name: {product.Name}, Price: {product.Price:C}, Quantity: {product.Quantity}");
            }

            if (products.Count == 0)
            {
                Console.WriteLine("No products found.");
            }
        }

        static void UpdateProductInformation()
        {
            Console.Write("Enter Product Name to update information: ");
            string nameToUpdate = Console.ReadLine();

            Product productToUpdate = products.Find(p => p.Name.Equals(nameToUpdate, StringComparison.OrdinalIgnoreCase));

            if (productToUpdate != null)
            {
                Console.WriteLine($"Current Information for Product '{productToUpdate.Name}':");
                Console.WriteLine($"Price: {productToUpdate.Price:C}, Quantity: {productToUpdate.Quantity}");

                Console.Write("Enter new Price: ");
                if (decimal.TryParse(Console.ReadLine(), out decimal newPrice) && newPrice >= 0)
                {
                    Console.Write("Enter new Quantity: ");
                    if (int.TryParse(Console.ReadLine(), out int newQuantity) && newQuantity >= 0)
                    {
                        productToUpdate.Price = newPrice;
                        productToUpdate.Quantity = newQuantity;
                        Console.WriteLine($"Product information updated for '{productToUpdate.Name}'.");
                    }
                    else
                    {
                        Console.WriteLine("Invalid quantity. Please enter a valid non-negative quantity.");
                    }
                }
                else
                {
                    Console.WriteLine("Invalid price. Please enter a valid non-negative price.");
                }
            }
            else
            {
                Console.WriteLine($"Product '{nameToUpdate}' not found in the inventory.");
            }
        }

        static void CheckProductAvailability()
        {
            Console.Write("Enter Product Name to check availability: ");
            string productName = Console.ReadLine();

            Product product = products.Find(p => p.Name.Equals(productName, StringComparison.OrdinalIgnoreCase));

            if (product != null)
            {
                Console.WriteLine($"Product '{product.Name}' is available. Quantity: {product.Quantity}");
            }
            else
            {
                Console.WriteLine($"Product '{productName}' not found in the inventory.");
            }
        }

        static void RemoveProduct()
        {
            Console.Write("Enter Product Name to remove: ");
            string productName = Console.ReadLine();

            Product productToRemove = products.Find(p => p.Name.Equals(productName, StringComparison.OrdinalIgnoreCase));

            if (productToRemove != null)
            {
                products.Remove(productToRemove);
                Console.WriteLine($"Product '{productName}' removed from the inventory.");
            }
            else
            {
                Console.WriteLine($"Product '{productName}' not found in the inventory.");
            }
        }

        static void Exit()
        {
            Console.WriteLine("Thank you for using StoreInventoryManager. Goodbye!");
            Environment.Exit(0);
        }
    }

    class Product
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public Product(string name, decimal price, int quantity)
        {
            Name = name;
            Price = price;
            Quantity = quantity;
        }
    }
}
