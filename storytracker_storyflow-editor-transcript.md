# StoryFlow Editor - Video Transcript

**Video:** 🔥Making Story Games? You NEED This Tool!  
**Channel:** Soulstices Dev.  
**URL:** https://www.youtube.com/watch?v=kR2FFxpM0AY  
**Date:** 31 October 2025

---

If you want to create your own narrative game, you're in the right place. I've spent the last two years building Storyflow Editor, a tool for creating complex branching stories. In my previous video, I explained how Storyflow Editor was built. In this one, we'll take a quick look under the hood, exploring the core technical systems that power your stories and how you can integrate them into your workflow.

Think of this as an overview. I'll be making step-by-step tutorials on these systems in future videos. Splitting stories into multiple files. As your project grows, it becomes increasingly difficult to keep track of all the different choices and branches. Storing your entire story as one massive flowchart isn't always practical.

Storyflow editor lets you split your stories into separate parts and reuse individual scripts. For example, you can store conversations with different characters in different files. You can launch new scripts using the run script node. Say I have two files starting from the first file. At some point, we use run script to jump into the second file.

Local and global variables.

Each file has its own local variables that are stored and can only be used within that file. However, you can also make a variable global. A globe icon will appear next to it, and this variable can then be used across any file in your project. Its state also persists when switching between scripts.

Code reusability.

Let me show you an example of how you can reuse parts of your logic. We have a dialogue with an NPC, and we want it to change depending on how many times we've already talked to this character.

To do this, we create an integer variable to track the number of visits to this NPC. We'll make it global since we'll be using it across different files in our project. Then at the start of each conversation with this NPC, we need to increment it by one.

But we don't want to copy and paste this logic into every single dialogue. So instead we create a new file and move this increment logic into it.

Now we can simply call this file using run script from anywhere in our project.

This was a simple example of how you can create reusable scripts conditional logic.

Now that we're tracking the number of NPC visits, we can create conditions to make the dialogue change based on this variable.

Using the branch node along with comparisons like greater than, less than, and equals, we can easily create conditions based on variable states.

These conditions can get quite complex. You can combine multiple variables and create sophisticated branching logic.

Runtime debugger

I've also added the ability to track variable changes in real time during runtime when you're testing inside the editor. You'll see a small button in the top right corner and clicking it opens a panel. As variables change, their values update instantly in this debugger.

Similarity to Unreal Engine blueprints.

As you may have noticed, the visual scripting system is very similar to blueprints in Unreal Engine. This provides some advantages.

Scenario one, someone already familiar with blueprints. It's easy for them to start working with story flow editor.

Scenario two, someone not familiar with blueprints. They start by learning story flow editor. If over time they want to work with Unreal Engine, it'll be easier for them to pick up blueprints thanks to the similarity between systems.

Performance.

When you have a large project with a huge number of nodes in one file, performance can suffer. I use viewport culling as an optimization technique where we only render the nodes that are currently visible in the viewport.

For example, I'll create several nodes and copy paste them many times. When zooming out, you can see the editor doesn't run as smoothly, and switching between tabs takes more time. In a real project, you'll organize your nodes better and won't encounter this many nodes on screen at once. I'll admit that right now it can be challenging to work with an extremely large number of nodes in a single file. However, this is mitigated by splitting your story into multiple files as I showed earlier in the video.

Nevertheless, I'll continue monitoring and improving performance throughout the app's development.

Comments.

I've added the ability to add comments. You should use these to write down information that you might forget after spending time away from the project.

user interface.

I've received a lot of comments from you about how good the user interface looks. Thank you. You have no idea how much time I spent working on it. For example, here's what the dialogue editing window used to look like. Then I moved it into a separate resizable panel on the right side to use space more efficiently. And then I refine the design to make it look even better. These kinds of things always take an enormous amount of time.

The foundation

releasing story flow editor on Steam will be the first phase. Then as I mentioned earlier, I'll start working on plugins to integrate projects into Unreal Engine, Unity, and Godo.

Technically, you can already integrate it yourself using theJSON export feature. However, that will require coding your own solution for parsing and working with the output JSON. The official plugins I'm developing will handle all of this for you, making integration seamless and straightforward.

Your feedback is crucial because if the foundation doesn't work well, there's no point in releasing additional plugins without fixing the core first. So, please leave your reviews on Steam. They're very important. And join the Discord community where I'll be running a poll about which engine plug-in you'd like to see first.

Thanks for watching and see you in the next
