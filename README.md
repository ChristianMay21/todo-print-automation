# Todoist Print Automation for Receipt Printers

This repository contains some scripts that allow you to pull tasks from Todoist and print them out on a receipt printer.

The code is configured to pull tasks that are due today or overdue, and print them out grouped by due time. The code in charge of this is fairly simple, and should be somewhat straightforward to customize for your preferences.

# Project background
I'm not fond of recurring tasks - things like remembering to do the laundry over the weekend, or unloading the dishwasher in the morning. So I wanted to have a nice system that would remind me of all of these tasks.

Years ago, I started tracking these tasks on Todoist. Each task has a recurring due date - for example "Every Saturday at 9am". The Todoist app would remind me to do each of these tasks, which was helpful.

However, as I've started to move away from smartphone use - they're just too distracting - I wanted some kind of analog equivalent.So I wrote some scripts that automatically pull my tasks using the Todoist API and print them out every morning at 6am.

This means when I wake up, whenever I feel I have some energy to do chores, I don't have to think - I just pick up the list and pick from there what I'd like to do.

For this to work well, I chose to use a receipt printer. Receipt printers are perfect for this because:

    Receipts easily fit in your pocket, so you can carry it around.

    Receipts have a dynamic height - as a result, my entire todo list is always on one page, and the length of the paper is exactly the length of the todo list itself.

The downside of receipt printers is that they're a pain in the ass to develop with.

In order for this system to know what tasks you have/have not completed, you still need to mark tasks as completed in Todoist

## How the code works

There are two scripts that work together: `index.js` (a JavaScript file) and `print.ps1`, a Powershell script.

The code starts by invoking `index.js`, and goes through these general steps:
1. Pulls your tasks from Todoist
2. Checks for any tasks that are either A. Overdue, or B. Due sometime today
3. Groups these tasks by the time of day they are due (if present), and saves these to a .txt file
4. Invokes `print.ps1`, which grabs the .txt file, formats it for printing using Microsoft Word, and sends it for printing to the default printer.

## Using this code
Please feel free to clone and customize this code for your own purposes. For anything public-facing, credit to me is not required but would be appreciated.

Please feel free to make pull requests, feature requests, or general suggestions, but please keep in mind that maintaining this repo is something I only do in my spare time, which can be limited. Any requests made rudely will likely be ignored.

All use of this code is at-your-own-risk. While I hope to be helpful, I cannot promise any support of this code - this repo purely exists as a starting point for others who wish to build similar projects to mine.

## System Requirements
This code was originally written for my personal use. As a result, it's only been tested with my own personal system, with my specific receipt printer.

In particular, the code has only been tested:
- With a Windows machine
- With a valid installation of Microsoft Word (text formatting unfortunately relies on Microsoft word - I'd love to find a way to remove it as a dependency)
- I have only tested printing with the Epson TM-T20III ([Amazon link](https://www.amazon.com/gp/product/B07YLSTMCX/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1), not an affiliate link)
- The receipt printer must be configured as your default printer

It may be possible to run this code on a non-Windows machine, since Powershell is available for those platforms, but I have not tested this. You would also need to find your own way to print automatically, as Task Scheduler is exclusive to Windows.

While the code is intended for - any only tested with - printing with a receipt printer, it should be fairly straightforward to modify it for use with traditional printers (see comments in `print.ps1` for some values you may need to tweak)

## Setting up this repository
- Make sure you have Node.js installed. If you install Node.js fresh, and it asks you if you should add it to the Path variable, say 'yes'.
- Clone this repo
- Make a copy of `exampleConfig.json` called `config.json`
- In `config.json`, modify the values `todoist-api-token` and `hour-difference-from-UTC`. The first value should contain your [Todoist API Token](https://todoist.com/help/articles/find-your-api-token-Jpzx9IIlB), and the second is a quick-and-dirty way to represent your timezone. If you live in UTC time, this value should be zero. If your time is 'later' than UTC time, this value should be a positive integer representing how many hours 'ahead' of UTC time you are. If your time is 'earlier' than UTC time, this vlaue should be a negative integer representing how many hours 'behind' UTC time you are.
- Open a terminal in the root directory of this repository
- Run `npm install` to download and install required Node modules.

## Running this code manually
To run this code manually, simply run `node index.js` from this project's root folder.

## Running this code automatically (on Windows)
I have this code configured to run automatically at the same time every morning using Task Scheduler.

In order to do this, you will need to follow the following steps:
1. Make sure your computer will be on at the scheduled time every day (it's okay if it's asleep - see Step 11)
2. Task Scheduler may not run automatic tasks on accounts that 
3. Open Task Scheduler, which should be included with Windows
4. Click "Create Task" in the right sidebar
5. In the "General" tab, check "Run whether user is logged in or not" if you want this task to run even when you are logged out
6. In the "General" tab, check "Run with highest privileges"
7. In "Triggers" click "New" > "Daily" and select your preferred time for the task to run. Click "OK"
8. In "Action" click "New" > "Start a program"
9. In the "program/script" section, you can just write "node" - if you have Node.js added to your path - or manually browse to your local Node.js installation and include it that way.
10. In the "Add arguments (optional)" section, put the file path to this repo's index script - e.g. `C:\Users\MyUser\Documents\repos\todo-automation\index.js`
11. If you want this task to run while the computer is asleep, check "Wake the computer to run this task" in the "Conditions" tab.
12. In "Settings", I recommend checking "Allow task to be run on demand", "Run task as soon as possible after a scheduled start is missed", "Stop the task if it runs longer than 1 hour", and "If the running task does not end when requested, force it to stop."
13. Click "OK" to save the task
14. To test running the task manually, you can find it in Task Scheduler, click on it, and click "Run" in the right sidebar, assuming that you checked "Allow task to be run on demand" in step 12.
15. If you have any issues with this setup, please feel free to reach out to me on Github or on Reddit at u/ChristianMay21, but please understand that it may take me a while to get back to you.

## Potential improvements
I would love to make this software usable by as many people as possible - that means making it:
- Stable
- Cross-platform
- Configurable
- Removing Microsoft Word as a dependency
- Supporting as many printers as possible

If you would like to contribute to these improvements - or others - pull requests are welcome. If you do not have time to contribute - but have ideas on how these challenges might be addressed - please let me know as well.