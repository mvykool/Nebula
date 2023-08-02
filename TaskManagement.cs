using System;
using System.Collections.Generic;
using System.IO;

namespace SimpleTaskManager
{
    class Program
    {
        static List<Task> tasks = new List<Task>();
        const string dataFilePath = "tasks.txt";

        static void Main(string[] args)
        {
            LoadTasks();

            while (true)
            {
                Console.WriteLine("\n********* Simple Task Manager *********");
                Console.WriteLine("1. Create Task");
                Console.WriteLine("2. Mark Task as Completed");
                Console.WriteLine("3. View All Tasks");
                Console.WriteLine("4. View Completed Tasks");
                Console.WriteLine("5. Exit");
                Console.Write("Select an option (1-5): ");

                if (int.TryParse(Console.ReadLine(), out int choice))
                {
                    switch (choice)
                    {
                        case 1:
                            CreateTask();
                            break;
                        case 2:
                            MarkTaskAsCompleted();
                            break;
                        case 3:
                            ViewAllTasks();
                            break;
                        case 4:
                            ViewCompletedTasks();
                            break;
                        case 5:
                            SaveTasks();
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

        static void CreateTask()
        {
            Console.WriteLine("\n**** Create New Task ****");

            Console.Write("Enter Task Description: ");
            string description = Console.ReadLine();

            Task newTask = new Task(description);
            tasks.Add(newTask);

            Console.WriteLine("Task created successfully.");
        }

        static void MarkTaskAsCompleted()
        {
            Console.WriteLine("\n**** Mark Task as Completed ****");
            int taskNumber = GetTaskNumber();

            if (taskNumber != -1)
            {
                tasks[taskNumber].IsCompleted = true;
                Console.WriteLine("Task marked as completed.");
            }
        }

        static void ViewAllTasks()
        {
            Console.WriteLine("\n**** All Tasks ****");
            int taskCount = 0;

            foreach (Task task in tasks)
            {
                taskCount++;
                Console.WriteLine($"{taskCount}. {task.Description} {(task.IsCompleted ? "(Completed)" : "")}");
            }

            if (taskCount == 0)
            {
                Console.WriteLine("No tasks found.");
            }
        }

        static void ViewCompletedTasks()
        {
            Console.WriteLine("\n**** Completed Tasks ****");
            int taskCount = 0;

            foreach (Task task in tasks)
            {
                if (task.IsCompleted)
                {
                    taskCount++;
                    Console.WriteLine($"{taskCount}. {task.Description}");
                }
            }

            if (taskCount == 0)
            {
                Console.WriteLine("No completed tasks found.");
            }
        }

        static int GetTaskNumber()
        {
            Console.Write("Enter Task Number: ");
            if (int.TryParse(Console.ReadLine(), out int taskNumber) && taskNumber > 0 && taskNumber <= tasks.Count)
            {
                return taskNumber - 1; // Subtracting 1 to get the correct index in the list
            }
            else
            {
                Console.WriteLine("Invalid task number. Please enter a valid task number.");
                return -1;
            }
        }

        static void LoadTasks()
        {
            if (File.Exists(dataFilePath))
            {
                string[] taskData = File.ReadAllLines(dataFilePath);
                foreach (string data in taskData)
                {
                    string[] taskInfo = data.Split(',');
                    if (taskInfo.Length == 2 &&
                        bool.TryParse(taskInfo[1], out bool isCompleted))
                    {
                        tasks.Add(new Task(taskInfo[0], isCompleted));
                    }
                }
                Console.WriteLine("Tasks loaded successfully.");
            }
        }

        static void SaveTasks()
        {
            List<string> taskData = new List<string>();
            foreach (Task task in tasks)
            {
                taskData.Add($"{task.Description},{task.IsCompleted}");
            }
            File.WriteAllLines(dataFilePath, taskData);
            Console.WriteLine("Tasks saved successfully.");
        }
    }

    class Task
    {
        public string Description { get; private set; }
        public bool IsCompleted { get; set; }

        public Task(string description)
        {
            Description = description;
            IsCompleted = false;
        }

        public Task(string description, bool isCompleted)
        {
            Description = description;
            IsCompleted = isCompleted;
        }
    }
}
