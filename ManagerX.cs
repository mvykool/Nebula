using System;
using System.Collections.Generic;
using System.Linq;

namespace TaskManagerX
{
    class Program
    {
        static List<TaskItem> tasks = new List<TaskItem>();

        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to TaskManagerX!");

            while (true)
            {
                Console.WriteLine("\n********* Task Manager *********");
                Console.WriteLine("1. Add Task");
                Console.WriteLine("2. View All Tasks");
                Console.WriteLine("3. Mark Task as Completed");
                Console.WriteLine("4. Delete Task");
                Console.WriteLine("5. Search Tasks");
                Console.WriteLine("6. Exit");
                Console.Write("Select an option (1-6): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            AddTask();
                            break;
                        case 2:
                            ViewAllTasks();
                            break;
                        case 3:
                            MarkTaskAsCompleted();
                            break;
                        case 4:
                            DeleteTask();
                            break;
                        case 5:
                            SearchTasks();
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

        static void AddTask()
        {
            Console.WriteLine("\n**** Add Task ****");

            Console.Write("Enter Task Description: ");
            string description = Console.ReadLine();

            Console.Write("Enter Due Date (e.g., yyyy-mm-dd): ");
            if (DateTime.TryParse(Console.ReadLine(), out DateTime dueDate))
            {
                TaskItem newTask = new TaskItem(description, dueDate);
                tasks.Add(newTask);
                Console.WriteLine($"Task added successfully. Task ID: {newTask.Id}");
            }
            else
            {
                Console.WriteLine("Invalid due date format. Please enter a valid date in the format yyyy-mm-dd.");
            }
        }

        static void ViewAllTasks()
        {
            Console.WriteLine("\n**** All Tasks ****");
            int taskCount = 0;

            foreach (TaskItem task in tasks)
            {
                taskCount++;
                string status = task.IsCompleted ? "Completed" : "Not Completed";
                Console.WriteLine($"{taskCount}. Task ID: {task.Id}, Description: {task.Description}, Due Date: {task.DueDate}, Status: {status}");
            }

            if (taskCount == 0)
            {
                Console.WriteLine("No tasks found.");
            }
        }

        static void MarkTaskAsCompleted()
        {
            Console.Write("Enter Task ID to mark as completed: ");
            if (int.TryParse(Console.ReadLine(), out int taskId) && taskId > 0 && taskId <= tasks.Count)
            {
                TaskItem task = tasks[taskId - 1];
                task.IsCompleted = true;
                Console.WriteLine($"Task ID: {task.Id} marked as completed.");
            }
            else
            {
                Console.WriteLine("Invalid task ID. Please enter a valid task ID.");
            }
        }

        static void DeleteTask()
        {
            Console.Write("Enter Task ID to delete: ");
            if (int.TryParse(Console.ReadLine(), out int taskId) && taskId > 0 && taskId <= tasks.Count)
            {
                TaskItem task = tasks[taskId - 1];
                tasks.Remove(task);
                Console.WriteLine($"Task ID: {task.Id} deleted.");
            }
            else
            {
                Console.WriteLine("Invalid task ID. Please enter a valid task ID.");
            }
        }

        static void SearchTasks()
        {
            Console.Write("Enter search keyword: ");
            string keyword = Console.ReadLine().ToLower();

            List<TaskItem> matchingTasks = tasks.FindAll(task =>
                task.Description.ToLower().Contains(keyword));

            if (matchingTasks.Count > 0)
            {
                Console.WriteLine("Matching Tasks:");
                int taskCount = 0;
                foreach (TaskItem task in matchingTasks)
                {
                    taskCount++;
                    string status = task.IsCompleted ? "Completed" : "Not Completed";
                    Console.WriteLine($"{taskCount}. Task ID: {task.Id}, Description: {task.Description}, Due Date: {task.DueDate}, Status: {status}");
                }
            }
            else
            {
                Console.WriteLine("No matching tasks found.");
            }
        }

        static void Exit()
        {
            Console.WriteLine("Goodbye!");
            Environment.Exit(0);
        }
    }

    class TaskItem
    {
        private static int nextId = 1;

        public int Id { get; private set; }
        public string Description { get; private set; }
        public DateTime DueDate { get; private set; }
        public bool IsCompleted { get; set; }

        public TaskItem(string description, DateTime dueDate)
        {
            Id = nextId++;
            Description = description;
            DueDate = dueDate;
            IsCompleted = false;
        }
    }
}
