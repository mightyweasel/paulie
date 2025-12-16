# paulie
Quick chat personas through LLM prompt policies

**NOTE:** This is a proof of concept / pilot. 

> A long time ago in a browser not so far away finding information on the web used to require a certain set of skills that not everyone knew about. Your results and my results weren't the same. Over time the search fields got smarter, and we could ask our questions with ease. We're now back to that same world again, but this time we've got a whole new cast of characters. Paulie aims to make working with popular LLMs a bit more focused for those just trying things out by creating prompt policies that help out.

## What is Paulie?

It's a Prompt Policy generator / customizer. Think of it like "Mad Libs for Prompts". Inside Paulie are some Prompt Policy Templates that have been generated with some "Fancy" features like mode toggles and other specific instructions depending on the "Persona" we want to simulate. Paulie will generate a form that you can use to tailor the prompt with specific details for your task. Then you can generate a ready to use prompt that you can provide to your LLM of choice. From there, use it like a virtual brainstorming support.

The idea here is to try things out in a low stakes and minimal setup sort of way (you can use the logged out versions of the LLM just to try things out). 

**It's important to note that these Prompt Policies aren't AI Agents**, but they can get you thinking in that way. If we added a control loop, and we had additional context we could use these kinds of prompts to make real agents in the future withe the right tools (Studios etc).

## Is this just an LLM Persona?

Not quite, LLM Personas and LLM Prompt Policies are similar, but there's a difference. Persona answers: "How should I speak?", Policy answers: 
"What am I allowed to do?"

A persona defines who the model is pretending to be and how it should sound. It focuses on:
* Voice, tone, attitude
* Role or identity (e.g., “senior backend engineer”, “Socratic tutor”)
* Communication style (formal, terse, friendly)
* Perspective or worldview (mentor, critic, assistant)

A prompt policy defines rules, constraints, and priorities governing behavior. It focuses on:
* What the model must or must not do
* Safety, legality, ethics
* Formatting rules
* Decision boundaries
* Instruction precedence

## What is a "Prompt Policy"

A Prompt Policy is a predefined set of instructions or guidelines that govern how a language model (like GPT) should respond to inputs. It defines the style, constraints, or behavior of the model without necessarily including autonomous decision-making or external action execution. Essentially, it’s a "behavior template" for generating outputs given prompts. Prompt Policies specify how the model should behave — an Agent decides what to do next. Prompt Policies answer: "How should I respond?", whereas an agent answers: "Should I respond, ask, act, search, retry, or stop?". In short: Prompt Policy = how the model should respond and Agent = what the model/system does in the world

### Key characteristics:
* Determines response style (formal, humorous, concise, detailed, etc.)
* Can include safety or ethical rules for output
* Applied per interaction with the model; doesn’t act independently
* Does not perform external actions beyond generating text

### Contrast with Agents:
* An Agent is an autonomous or semi-autonomous system that uses models like GPT to perform tasks, often by interacting with external tools, APIs, or environments
* Agents make decisions, plan sequences of actions, and execute steps based on observations.

### What are Prompt Policies good at?
* Expert simulation
* Consistent analysis
* Reducing hallucination
* Enforcing structure
* Human-facing decision support
* Regulated-domain drafting (with disclaimers)

It's best when:
* Humans remain in the loop
* Outputs are reviewed
* Stakes are high but actions are indirect

### What Prompt Policies Can't Do
No Matter How Well Written - It cannot:
* Run Active Learning loops
* Orchestrate tools over time
* Manage failures
* Trigger retraining
* Escalate to humans conditionally
* Adapt strategy across turns without re-prompting
