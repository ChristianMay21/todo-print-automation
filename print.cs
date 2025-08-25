using System;
using System.IO;

namespace TaskReader
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                // Get the directory where the executable is located
                string currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
                
                // Construct the path to the tasks.rtf file
                string filePath = Path.Combine(currentDirectory, "tasks.rtf");
                
                // Check if the file exists
                if (!File.Exists(filePath))
                {
                    Console.WriteLine($"Error: tasks.rtf file not found in directory: {currentDirectory}");
                    Console.WriteLine("Press any key to exit...");
                    Console.ReadKey();
                    return;
                }
                
                // Read and print the file contents
                Console.WriteLine("Contents of tasks.rtf:");
                Console.WriteLine(new string('-', 50));
                
                string fileContents = File.ReadAllText(filePath);
                Console.WriteLine(fileContents);
                
                Console.WriteLine(new string('-', 50));
                Console.WriteLine($"File location: {filePath}");
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"Error: Access denied when trying to read the file. {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"Error: IO exception occurred. {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: An unexpected error occurred. {ex.Message}");
            }
            
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}