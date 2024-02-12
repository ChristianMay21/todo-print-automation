import { TodoistApi } from "@doist/todoist-api-typescript";
import { writeFile } from "fs";
import { readFile } from "fs/promises";
import { spawn } from "child_process";
import path from "path";

async function fetchAndPrintTodoList() {
  // Read and parse the config
  const config = JSON.parse(
    await readFile(new URL("./config.json", import.meta.url))
  );

  const api = new TodoistApi(config["todoist-api-token"]);

  // Get the current time in UTC
  const currentTime = new Date();

  // Convert to local time
  currentTime.setHours(
    currentTime.getHours() + config["hour-difference-from-UTC"]
  );

  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth() + 1;
  const currentDay = currentTime.getDate();

  // Determine if passed task should be included in the printed task list
  // The requirements here are based on my personal preferences - you may want to modify them
  function includeTask(task) {

    //If the task does not have a due date, do not include it in the task list
    if (task.due === null) {
      return false;
    }

    
    const splitTaskString = task.due.date.split("-");
    const taskYear = Number(splitTaskString[0]);
    const taskMonth = Number(splitTaskString[1]);
    const taskDay = Number(splitTaskString[2]);

    //Include any tasks due in a previous year
    if (taskYear < currentYear) {
      return true;
    }

    //Include tasks due this year, in a previous month
    if (taskYear === currentYear && taskMonth < currentMonth) {
      return true;
    }

    //Include tasks due this year, this month, on a previous day or today
    if (
      taskYear === currentYear &&
      taskMonth === currentMonth &&
      taskDay <= currentDay
    ) {
      return true;
    }

    //Any other tasks, do not include
    return false;
  }

  // When my tasks are printed, I prefer to group them by the time that they are due, with each group listed in chronological order.
  // Not all tasks in Todoist have a due time - some only have a due date. All of these tasks I include in a group labelled "Any time today:"
  function getTimeTaskIsDue(task) {
    if (task.due.datetime === undefined) {
      return "Any time today:";
    }
    let taskDueDateTime = new Date(task.due.datetime);
    //The statement below simply formats the datetime string returned by todoist into a more human-readable time, e.g. 9:00,
    return (
      "" +
      taskDueDateTime.getHours() +
      ":" +
      (taskDueDateTime.getMinutes() < 10 ? "0" : "") +
      taskDueDateTime.getMinutes()
    );
  }

  //Given two separate tasks, this function determines which of the two should come first
  function sortByTime(task1, task2) {
    //If neither task has a specific time they're due, they are 'equal'
    if (task1.due.datetime === undefined && task2.due.datetime === undefined) {
      return 0;
    }

    //If the first task has no specific time, but the second task does, the second task should appear first
    if (task1.due.datetime === undefined && task2.due.datetime !== undefined) {
      return 1;
    }

    if (task1.due.datetime !== undefined && task2.due.datetime === undefined) {
      return -1;
    }

    let task1DueDate = new Date(task1.due.datetime);
    let task2DueDate = new Date(task2.due.datetime);

    return task1DueDate.getHours() - task2DueDate.getHours();
  }

  function print() {
    // Define the name of the PowerShell script
    const scriptName = path.join(process.cwd(), "print.ps1");

    // Create a child process to execute the script
    const child = spawn("powershell.exe", ["-File", scriptName]);

    // Listen for data from the script's stdout
    child.stdout.on("data", (data) => {
      console.log(`Script output: ${data.toString()}`);
    });

    // Listen for errors, if any
    child.stderr.on("data", (error) => {
      console.error(`Script error: ${error.toString()}`);
    });

    // Listen for the script to exit
    child.on("close", (code) => {
      if (code === 0) {
        console.log(`Script completed successfully.`);
      } else {
        console.error(`Script exited with code ${code}`);
      }
    });
  }

  api
    .getTasks()
    .then((tasks) => {
      // This variable contains all tasks that should be included in the todo list printout
      let includedTasks = tasks.filter(includeTask).sort(sortByTime);

      // Dates are in standard US format (MM/DD/YYYY)
      let stringOutput = `Date: ${currentMonth}/${currentDay}/${currentYear} \n`;

      // When printed, each task is numbered 1, 2, 3...
      //This variable keeps track of the current task index.
      let taskNum = 1;

      // When printed, tasks are grouped by time they are due
      // This variable keeps track of the current grouping
      let currentScheduledTime = "";

      for (const task of includedTasks) {
        // This block creates the headings for each time grouping
        if (getTimeTaskIsDue(task) !== currentScheduledTime) {
          stringOutput += `\n${getTimeTaskIsDue(task)} \n`;
          currentScheduledTime = getTimeTaskIsDue(task);
        }

        // Add the entry for each individual task
        stringOutput += `${taskNum}. ${task.content}\n`;
        taskNum++;
      }

      // Write all tasks to a .txt file - this .txt file will be used by the Powershell script that actually prints the tasks
      writeFile(
        "tasks.txt",
        stringOutput,
        (err) => {
          if (err) {
            console.error(err);
          }
        },
        () => {
          // Invoke the powershell script that handles formatting the tasks and printing them
          print();
        }
      );
    })
    .catch((error) => console.log(error));
}

// Actually invoke all of the functionality defined above
await fetchAndPrintTodoList();
