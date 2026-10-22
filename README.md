# HelpDesk: Support Ticket System (Demo)

A front-end prototype of a support ticket system with two roles (user and agent), built to model a real help desk workflow with SLA tracking.

> **Note:** this is a prototype in vanilla JavaScript with data stored in the browser (localStorage). I am currently rebuilding it in Angular and TypeScript with a real backend.

## Features
- Login with roles: users see their own tickets, agents see all tickets
- Create tickets with priority (high, medium, low)
- Assign tickets, change status (open, in progress, resolved) and add comments
- SLA per priority (4 h, 24 h, 72 h) with overdue warnings
- Search and filters by status and priority
- Agent dashboard: totals, overdue SLA, tickets by priority and workload per agent

## Demo accounts
- User: `ana` / `demo`
- Agent: `carlos` / `demo`

## Tech stack
HTML5, CSS3, vanilla JavaScript

## Run locally
Open the folder in VS Code and use the Live Server extension.

## Roadmap
- Angular + TypeScript version with reactive forms and route guards
- Real authentication and database (SQL Server)
- Unit tests

## Author
Miguel Laurencio
