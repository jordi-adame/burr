====================
Agents
====================

Burr allows you to create agents that can interact with each other via State.

Multi-Agent Example
--------------------

A single agent can usually operate effectively using a handful of tools within a single domain, but even using powerful
models like `gpt-4`, it can be less effective at using many tools.

One way to approach complicated tasks is through a "divide-and-conquer" approach: create a "specialized agent" for
each task or domain and route tasks to the correct "expert". This means that each agent can become a sequence of LLM
calls that chooses how to use a specific "tool".

The examples we link to below are inspired by the paper `AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation by Wu, et. al.<https://arxiv.org/abs/2308.08155>`_.
They can be found in `this part of our repository <https://github.com/DAGWorks-Inc/burr/tree/main/examples/multi-agent-collaboration>`_.

Using LCEL:


Using Hamilton:
