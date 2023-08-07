using System;
using System.Collections.Generic;
using System.IO;

namespace SimpleBookManagementSystem
{
    class Program
    {
        static List<Book> library = new List<Book>();
        const string dataFilePath = "books.txt";

        static void Main(string[] args)
        {
            LoadBooks();

            while (true)
            {
                Console.WriteLine("\n********* Simple Book Management System *********");
                Console.WriteLine("1. Add New Book");
                Console.WriteLine("2. View All Books");
                Console.WriteLine("3. Search for a Book");
                Console.WriteLine("4. Remove Book");
                Console.WriteLine("5. Exit");
                Console.Write("Select an option (1-5): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            AddNewBook();
                            break;
                        case 2:
                            ViewAllBooks();
                            break;
                        case 3:
                            SearchForBook();
                            break;
                        case 4:
                            RemoveBook();
                            break;
                        case 5:
                            SaveBooks();
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

        static void AddNewBook()
        {
            Console.WriteLine("\n**** Add New Book ****");

            Console.Write("Enter Book Title: ");
            string title = Console.ReadLine();

            Console.Write("Enter Author Name: ");
            string author = Console.ReadLine();

            Book newBook = new Book(title, author);
            library.Add(newBook);

            Console.WriteLine("Book added successfully.");
        }

        static void ViewAllBooks()
        {
            Console.WriteLine("\n**** All Books ****");
            int bookCount = 0;

            foreach (Book book in library)
            {
                bookCount++;
                Console.WriteLine($"{bookCount}. {book.Title} by {book.Author}");
            }

            if (bookCount == 0)
            {
                Console.WriteLine("No books found in the library.");
            }
        }

        static void SearchForBook()
        {
            Console.WriteLine("\n**** Search for a Book ****");
            Console.Write("Enter Book Title: ");
            string searchTitle = Console.ReadLine();

            List<Book> matchingBooks = library.FindAll(book => book.Title.Contains(searchTitle, StringComparison.OrdinalIgnoreCase));

            if (matchingBooks.Count > 0)
            {
                Console.WriteLine("Matching Books:");
                int bookCount = 0;
                foreach (Book book in matchingBooks)
                {
                    bookCount++;
                    Console.WriteLine($"{bookCount}. {book.Title} by {book.Author}");
                }
            }
            else
            {
                Console.WriteLine("No matching books found.");
            }
        }

        static void RemoveBook()
        {
            Console.WriteLine("\n**** Remove Book ****");
            int bookNumber = GetBookNumber();

            if (bookNumber != -1)
            {
                library.RemoveAt(bookNumber);
                Console.WriteLine("Book removed from the library.");
            }
        }

        static int GetBookNumber()
        {
            Console.Write("Enter Book Number: ");
            if (int.TryParse(Console.ReadLine(), out int bookNumber) && bookNumber > 0 && bookNumber <= library.Count)
            {
                return bookNumber - 1; // Subtracting 1 to get the correct index in the list
            }
            else
            {
                Console.WriteLine("Invalid book number. Please enter a valid book number.");
                return -1;
            }
        }

        static void LoadBooks()
        {
            if (File.Exists(dataFilePath))
            {
                string[] bookData = File.ReadAllLines(dataFilePath);
                foreach (string data in bookData)
                {
                    string[] bookInfo = data.Split(',');
                    if (bookInfo.Length == 2)
                    {
                        library.Add(new Book(bookInfo[0], bookInfo[1]));
                    }
                }
                Console.WriteLine("Books loaded successfully.");
            }
        }

        static void SaveBooks()
        {
            List<string> bookData = new List<string>();
            foreach (Book book in library)
            {
                bookData.Add($"{book.Title},{book.Author}");
            }
            File.WriteAllLines(dataFilePath, bookData);
            Console.WriteLine("Books saved successfully.");
        }
    }

    class Book
    {
        public string Title { get; private set; }
        public string Author { get; private set; }

        public Book(string title, string author)
        {
            Title = title;
            Author = author;
        }
    }
}
