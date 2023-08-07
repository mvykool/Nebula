using System;
using System.Collections.Generic;
using System.IO;

namespace ContactManagerPro
{
    class Program
    {
        static List<Contact> contacts = new List<Contact>();
        const string dataFilePath = "contacts.txt";

        static void Main(string[] args)
        {
            LoadContacts();

            while (true)
            {
                Console.WriteLine("\n********* Contact Manager Pro *********");
                Console.WriteLine("1. Add New Contact");
                Console.WriteLine("2. View All Contacts");
                Console.WriteLine("3. Search for a Contact");
                Console.WriteLine("4. Update Contact Information");
                Console.WriteLine("5. Delete Contact");
                Console.WriteLine("6. Exit");
                Console.Write("Select an option (1-6): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            AddNewContact();
                            break;
                        case 2:
                            ViewAllContacts();
                            break;
                        case 3:
                            SearchForContact();
                            break;
                        case 4:
                            UpdateContact();
                            break;
                        case 5:
                            DeleteContact();
                            break;
                        case 6:
                            SaveContacts();
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

        static void AddNewContact()
        {
            Console.WriteLine("\n**** Add New Contact ****");

            Console.Write("Enter First Name: ");
            string firstName = Console.ReadLine();

            Console.Write("Enter Last Name: ");
            string lastName = Console.ReadLine();

            Console.Write("Enter Email Address: ");
            string email = Console.ReadLine();

            Console.Write("Enter Phone Number: ");
            string phone = Console.ReadLine();

            Contact newContact = new Contact(firstName, lastName, email, phone);
            contacts.Add(newContact);

            Console.WriteLine("Contact added successfully.");
        }

        static void ViewAllContacts()
        {
            Console.WriteLine("\n**** All Contacts ****");
            int contactCount = 0;

            foreach (Contact contact in contacts)
            {
                contactCount++;
                Console.WriteLine($"{contactCount}. {contact.FirstName} {contact.LastName}, Email: {contact.Email}, Phone: {contact.Phone}");
            }

            if (contactCount == 0)
            {
                Console.WriteLine("No contacts found.");
            }
        }

        static void SearchForContact()
        {
            Console.WriteLine("\n**** Search for a Contact ****");
            Console.Write("Enter First Name or Last Name: ");
            string searchTerm = Console.ReadLine().ToLower();

            List<Contact> matchingContacts = contacts.FindAll(contact =>
                contact.FirstName.ToLower().Contains(searchTerm) || contact.LastName.ToLower().Contains(searchTerm));

            if (matchingContacts.Count > 0)
            {
                Console.WriteLine("Matching Contacts:");
                int contactCount = 0;
                foreach (Contact contact in matchingContacts)
                {
                    contactCount++;
                    Console.WriteLine($"{contactCount}. {contact.FirstName} {contact.LastName}, Email: {contact.Email}, Phone: {contact.Phone}");
                }
            }
            else
            {
                Console.WriteLine("No matching contacts found.");
            }
        }

        static void UpdateContact()
        {
            Console.WriteLine("\n**** Update Contact Information ****");
            int contactNumber = GetContactNumber();

            if (contactNumber != -1)
            {
                Contact contactToUpdate = contacts[contactNumber];

                Console.WriteLine("Current Information:");
                Console.WriteLine($"First Name: {contactToUpdate.FirstName}");
                Console.WriteLine($"Last Name: {contactToUpdate.LastName}");
                Console.WriteLine($"Email: {contactToUpdate.Email}");
                Console.WriteLine($"Phone: {contactToUpdate.Phone}");

                Console.WriteLine("\nEnter new information:");

                Console.Write("First Name: ");
                string firstName = Console.ReadLine();

                Console.Write("Last Name: ");
                string lastName = Console.ReadLine();

                Console.Write("Email Address: ");
                string email = Console.ReadLine();

                Console.Write("Phone Number: ");
                string phone = Console.ReadLine();

                contactToUpdate.FirstName = firstName;
                contactToUpdate.LastName = lastName;
                contactToUpdate.Email = email;
                contactToUpdate.Phone = phone;

                Console.WriteLine("Contact information updated successfully.");
            }
        }

        static void DeleteContact()
        {
            Console.WriteLine("\n**** Delete Contact ****");
            int contactNumber = GetContactNumber();

            if (contactNumber != -1)
            {
                contacts.RemoveAt(contactNumber);
                Console.WriteLine("Contact deleted successfully.");
            }
        }

        static int GetContactNumber()
        {
            Console.Write("Enter Contact Number: ");
            if (int.TryParse(Console.ReadLine(), out int contactNumber) && contactNumber > 0 && contactNumber <= contacts.Count)
            {
                return contactNumber - 1; // Subtracting 1 to get the correct index in the list
            }
            else
            {
                Console.WriteLine("Invalid contact number. Please enter a valid contact number.");
                return -1;
            }
        }

        static void LoadContacts()
        {
            if (File.Exists(dataFilePath))
            {
                string[] contactData = File.ReadAllLines(dataFilePath);
                foreach (string data in contactData)
                {
                    string[] contactInfo = data.Split(',');
                    if (contactInfo.Length == 4)
                    {
                        contacts.Add(new Contact(contactInfo[0], contactInfo[1], contactInfo[2], contactInfo[3]));
                    }
                }
                Console.WriteLine("Contacts loaded successfully.");
            }
        }

        static void SaveContacts()
        {
            List<string> contactData = new List<string>();
            foreach (Contact contact in contacts)
            {
                contactData.Add($"{contact.FirstName},{contact.LastName},{contact.Email},{contact.Phone}");
            }
            File.WriteAllLines(dataFilePath, contactData);
            Console.WriteLine("Contacts saved successfully.");
        }
    }

    class Contact
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Contact(string firstName, string lastName, string email, string phone)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
        }
    }
}
