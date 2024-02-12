# Todoist Print Automation for Receipt Printers

This repository contains some scripts that allow you to pull tasks from Todoist and print them out on a receipt printer.

The code is configured to pull tasks that are due today or overdue, and print them out grouped by due time. The code in charge of this is fairly simple, and should be somewhat straightforward to customize for your preferences.

## Using this code
Please feel free to clone and customize this code for your own purposes. For anything public-facing, credit to me is not required but would be appreciated.

Please feel free to make pull requests, feature requests, or general suggestions, but please keep in mind that maintaining this repo is something I only do in my spare time, which can be limited. Any requests made rudely will likely be ignored.

All use of this code is at-your-own-risk. While I hope to be helpful, I cannot promise any support of this code - this repo purely exists as a starting point for others who wish to build similar projects to mine.

## System Requirements
This code was originally written for my personal use. As a result, it's only been tested with my own personal system, with my specific receipt printer.

In particular, the code has only been tested:
- With a Windows machine
- With a valid installation of Microsoft Word (text formatting unfortunately relies on Microsoft word - I'd love to find a way to remove it as a dependency)
- I have only tested printing with the Epson TM-T20III (Amazon link: https://www.amazon.com/gp/product/B07YLSTMCX/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1, not an affiliate link)
- The receipt printer must be configured as your default printer

It may be possible to run this code on a non-Windows machine, since Powershell is available for those platforms, but I have not tested this. You would also need to find your own way to print automatically, as Task Scheduler is exclusive to Windows.

## Setting up this repository
- Make sure you have Node.js installed. If you install Node.js for this, and it asks you if you should add it to the Path variable, say 'yes'.
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