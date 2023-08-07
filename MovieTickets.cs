using System;
using System.Collections.Generic;

namespace MovieTicketBooker
{
    class Program
    {
        static List<Movie> movies = new List<Movie>();

        static void Main(string[] args)
        {
            InitializeMovies();

            Console.WriteLine("Welcome to MovieTicketBooker!");
            Console.WriteLine("Here are the available movies:");

            while (true)
            {
                DisplayMovieSchedule();

                Console.WriteLine("Enter the movie number to book tickets (or '0' to exit): ");
                if (int.TryParse(Console.ReadLine(), out int choice) && choice >= 0 && choice <= movies.Count)
                {
                    if (choice == 0)
                    {
                        Console.WriteLine("Thank you for using MovieTicketBooker. Goodbye!");
                        break;
                    }
                    BookTickets(choice);
                }
                else
                {
                    Console.WriteLine("Invalid input. Please enter a valid movie number.");
                }
            }
        }

        static void InitializeMovies()
        {
            // Sample movies with their schedule and initial available seats
            movies.Add(new Movie("Avengers: Endgame", "Action/Adventure", 150, 10));
            movies.Add(new Movie("Inception", "Sci-Fi/Thriller", 120, 15));
            movies.Add(new Movie("The Shawshank Redemption", "Drama/Crime", 142, 20));
        }

        static void DisplayMovieSchedule()
        {
            Console.WriteLine("\n********* Movie Schedule *********");
            int movieNumber = 1;

            foreach (Movie movie in movies)
            {
                Console.WriteLine($"{movieNumber}. {movie.Title} ({movie.Genre}) - Duration: {movie.Duration} minutes");
                Console.WriteLine($"   Available Seats: {movie.AvailableSeats}");
                movieNumber++;
            }

            Console.WriteLine("0. Exit");
        }

        static void BookTickets(int movieNumber)
        {
            Movie selectedMovie = movies[movieNumber - 1];

            Console.WriteLine($"\nBooking tickets for '{selectedMovie.Title}'...");

            Console.Write("Enter the number of tickets to book: ");
            if (int.TryParse(Console.ReadLine(), out int numberOfTickets) && numberOfTickets > 0)
            {
                if (selectedMovie.AvailableSeats >= numberOfTickets)
                {
                    selectedMovie.BookTickets(numberOfTickets);
                    Console.WriteLine($"{numberOfTickets} ticket(s) booked successfully for '{selectedMovie.Title}'. Enjoy the movie!");
                }
                else
                {
                    Console.WriteLine($"Sorry, only {selectedMovie.AvailableSeats} seat(s) available for '{selectedMovie.Title}'.");
                }
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a valid number of tickets.");
            }
        }
    }

    class Movie
    {
        public string Title { get; private set; }
        public string Genre { get; private set; }
        public int Duration { get; private set; }
        public int AvailableSeats { get; private set; }

        public Movie(string title, string genre, int duration, int availableSeats)
        {
            Title = title;
            Genre = genre;
            Duration = duration;
            AvailableSeats = availableSeats;
        }

        public void BookTickets(int numberOfTickets)
        {
            AvailableSeats -= numberOfTickets;
        }
    }
}
