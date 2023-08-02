using System;
using System.Collections.Generic;

namespace AdventureQuest
{
    class Program
    {
        static List<string> inventory = new List<string>();
        static bool hasSpecialItem = false;
        static bool hasDefeatedBoss = false;
        static bool gameOver = false;

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to Adventure Quest!");

            while (!gameOver)
            {
                Console.WriteLine("\n*********************************");
                Console.WriteLine("You find yourself in a room. What do you do?");
                Console.WriteLine("1. Look around the room");
                Console.WriteLine("2. Move to another room");
                Console.WriteLine("3. Check inventory");
                Console.WriteLine("4. Quit the game");
                Console.Write("Enter your choice (1-4): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            LookAroundRoom();
                            break;
                        case 2:
                            MoveToAnotherRoom();
                            break;
                        case 3:
                            CheckInventory();
                            break;
                        case 4:
                            gameOver = true;
                            Console.WriteLine("Thanks for playing Adventure Quest!");
                            break;
                        default:
                            Console.WriteLine("Invalid option. Please select a valid option (1-4).");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("Invalid input. Please enter a valid number.");
                }

                if (hasDefeatedBoss)
                {
                    Console.WriteLine("\nCongratulations! You have defeated the final boss and completed Adventure Quest!");
                    gameOver = true;
                }
            }
        }

        static void LookAroundRoom()
        {
            Console.WriteLine("You look around the room and find:");

            Random random = new Random();
            int itemChance = random.Next(1, 101);

            if (itemChance <= 30) // 30% chance of finding an item
            {
                string[] items = { "Health Potion", "Sword", "Shield", "Key" };
                int randomIndex = random.Next(items.Length);
                string foundItem = items[randomIndex];

                Console.WriteLine($"You found a {foundItem}!");
                inventory.Add(foundItem);

                if (foundItem == "Key" && !hasSpecialItem)
                {
                    Console.WriteLine("You have found the special key. Keep searching for the special item.");
                    hasSpecialItem = true;
                }
            }
            else
            {
                Console.WriteLine("Nothing useful in this room.");
            }
        }

        static void MoveToAnotherRoom()
        {
            if (hasDefeatedBoss)
            {
                Console.WriteLine("You have already defeated the final boss. There are no more rooms to explore.");
                return;
            }

            if (inventory.Contains("Key"))
            {
                Console.WriteLine("You unlocked a secret passage and moved to another room.");

                Random random = new Random();
                int enemyChance = random.Next(1, 101);

                if (enemyChance <= 40) // 40% chance of encountering an enemy
                {
                    Console.WriteLine("An enemy attacks you!");

                    int playerHealth = 100;
                    int enemyHealth = 50;

                    while (playerHealth > 0 && enemyHealth > 0)
                    {
                        Console.WriteLine("\nPlayer Health: " + playerHealth);
                        Console.WriteLine("Enemy Health: " + enemyHealth);
                        Console.WriteLine("1. Attack");
                        Console.WriteLine("2. Run away");
                        Console.Write("Enter your choice (1-2): ");

                        if (int.TryParse(Console.ReadLine(), out int choice))
                        {
                            if (choice == 1)
                            {
                                int playerAttack = random.Next(10, 21);
                                int enemyAttack = random.Next(5, 16);

                                enemyHealth -= playerAttack;
                                playerHealth -= enemyAttack;

                                if (playerHealth <= 0)
                                {
                                    Console.WriteLine("You have been defeated. Game Over!");
                                    gameOver = true;
                                }
                            }
                            else if (choice == 2)
                            {
                                Console.WriteLine("You manage to escape from the enemy.");
                                return;
                            }
                            else
                            {
                                Console.WriteLine("Invalid option. Please select a valid option (1-2).");
                            }
                        }
                        else
                        {
                            Console.WriteLine("Invalid input. Please enter a valid number.");
                        }
                    }

                    if (enemyHealth <= 0)
                    {
                        Console.WriteLine("You have defeated the enemy!");
                    }
                }
                else
                {
                    Console.WriteLine("The room is empty. Keep exploring!");
                }
            }
            else
            {
                Console.WriteLine("You need to find the special key to unlock the secret passage.");
            }
        }

        static void CheckInventory()
        {
            Console.WriteLine("\n**** Inventory ****");
            if (inventory.Count > 0)
            {
                foreach (string item in inventory)
                {
                    Console.WriteLine(item);
                }
            }
            else
            {
                Console.WriteLine("Your inventory is empty.");
            }
        }
    }
}
