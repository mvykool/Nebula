using System;
using System.Collections.Generic;

namespace QuizzyTime
{
    class Program
    {
        static List<Question> questions = new List<Question>();
        static int score = 0;

        static void Main(string[] args)
        {
            InitializeQuestions();

            Console.WriteLine("Welcome to Quizzy Time! Let's get started with the quiz.");
            Console.WriteLine("You will be presented with multiple-choice questions. Choose the correct option by typing the letter (A, B, C, or D).");
            Console.WriteLine("Press Enter to start the quiz...");
            Console.ReadLine();

            for (int i = 0; i < questions.Count; i++)
            {
                Console.Clear();
                Question currentQuestion = questions[i];

                Console.WriteLine($"Question {i + 1}: {currentQuestion.QuestionText}");
                Console.WriteLine("A. " + currentQuestion.Options[0]);
                Console.WriteLine("B. " + currentQuestion.Options[1]);
                Console.WriteLine("C. " + currentQuestion.Options[2]);
                Console.WriteLine("D. " + currentQuestion.Options[3]);
                Console.Write("Your answer: ");

                string playerAnswer = Console.ReadLine().ToUpper();

                if (playerAnswer == currentQuestion.CorrectAnswer)
                {
                    Console.WriteLine("Correct!");
                    score++;
                }
                else
                {
                    Console.WriteLine($"Wrong! The correct answer is {currentQuestion.CorrectAnswer}.");
                }

                Console.WriteLine("Press Enter to continue...");
                Console.ReadLine();
            }

            Console.Clear();
            Console.WriteLine("Quizzy Time is over! Let's see how you did.");

            Console.WriteLine("\n********** Quiz Results **********");
            Console.WriteLine($"Total Questions: {questions.Count}");
            Console.WriteLine($"Correct Answers: {score}");
            Console.WriteLine($"Incorrect Answers: {questions.Count - score}");

            Console.WriteLine("\n********** Correct Answers **********");
            for (int i = 0; i < questions.Count; i++)
            {
                Console.WriteLine($"Question {i + 1}: {questions[i].CorrectAnswer}");
            }

            Console.WriteLine("\nThanks for playing Quizzy Time!");
        }

        static void InitializeQuestions()
        {
            questions.Add(new Question(
                "What is the capital of France?",
                new List<string> { "Paris", "Rome", "Berlin", "London" },
                "A"));

            questions.Add(new Question(
                "Which planet is known as the 'Red Planet'?",
                new List<string> { "Venus", "Mars", "Jupiter", "Neptune" },
                "B"));

            questions.Add(new Question(
                "What is the largest mammal in the world?",
                new List<string> { "Elephant", "Blue Whale", "Giraffe", "Hippopotamus" },
                "B"));

            questions.Add(new Question(
                "Which famous scientist developed the theory of general relativity?",
                new List<string> { "Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla" },
                "B"));

            questions.Add(new Question(
                "What is the chemical symbol for the element oxygen?",
                new List<string> { "O", "C", "H", "N" },
                "A"));
        }
    }

    class Question
    {
        public string QuestionText { get; private set; }
        public List<string> Options { get; private set; }
        public string CorrectAnswer { get; private set; }

        public Question(string questionText, List<string> options, string correctAnswer)
        {
            QuestionText = questionText;
            Options = options;
            CorrectAnswer = correctAnswer;
        }
    }
}
