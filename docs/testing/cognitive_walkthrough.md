# NodeRace Cognitive Walkthrough

## Purpose
The purpose of this walkthrough is to evaluate the usability of **NodeRace**, a multiplayer web-based game designed to help students learn DFS and BFS traversal concepts in an engaging and competitive way. The walkthrough will simulate both the **host** and **student** experiences within a group of 6 participants (1 host, 5 students). This walkthrough is intended to prepare for an upcoming usability test session and directly ties to the following **success objectives**:

1. **Accessibility & Completion**: At least 90% of students who have completed COMP103 can complete a game session.  
2. **Usability (SUS > 68)**: The game achieves a SUS score above 68.  
3. **Learning Effectiveness**: 80% of students correctly answer DFS and BFS questions.  
4. **Host Controls**: 100% of hosts can create/manage lobbies with up to 30 students.  
5. **Engagement**: At least 85% of players remain active in a 5-minute session.  
6. **Performance**: Game loads within 5s, responds within 200ms for 95% of interactions.  
7. **Analytics**: Hosts can view live performance metrics during and after the session (SUS > 68 for analytics view).

## User Profiles
- **Host**: A tutor, responsible for setting up a session, managing students, and monitoring analytics.  
- **Student**: A past COMP103 student who has completed the course and is familiar with tree traversal concepts. Plays competitively in real-time against peers.

## Tasks & Scenarios
The walkthrough is structured as a sequence of steps simulating a real test session for a group of 6 players.

### Step 1: Tutorial (All Players)
- Each participant launches NodeRace and completes the interactive tutorial.  
- Goal: Familiarize with controls, UI, and mechanics.  
- Observations: Do players understand how to navigate, answer traversal questions, and receive feedback?

### Step 2: Solo Mode (All Players)
- Each participant plays a solo mode round to reinforce their understanding.  
- Goal: Build confidence before multiplayer play.  
- Observations: Do students understand how DFS/BFS questions are presented? Do they successfully complete a round?

### Step 3: Multiplayer Lobby (1 Host + 5 Students)
- **Host Tasks**:  
  1. Create a lobby.  
  2. Share lobby code.  
  3. Admit players into the lobby.  
  4. Remove any inactive participants if needed.  
  5. Start the session.  
  6. Monitor live analytics (active players, question times, leaderboard).  
  7. End session and review final analytics.

- **Student Tasks**:  
  1. Join the lobby using the provided code.  
  2. Play the round, answering DFS/BFS traversal questions under time pressure.  
  3. Check leaderboard placement and feedback after each question.  
  4. Stay active throughout the session (avoid inactivity disconnection).

## Success Metrics to Observe
- **Task Completion Rate**: % of students completing tutorial, solo mode, and multiplayer session (Obj. 1).  
- **SUS Questionnaire**: To be administered after the session (Obj. 2 & 7).  
- **Learning Effectiveness**: % of correct DFS/BFS answers across students (Obj. 3).  
- **Host Functionality**: Ability to create, manage, and launch games with no failures (Obj. 4).  
- **Engagement Tracking**: Monitor active vs. inactive players over 5 minutes (Obj. 5).  
- **Performance Logs**: Record load time (<5s) and input latency (<200ms) (Obj. 6).  
- **Analytics Accessibility**: Verify availability and usability of both live and post-session metrics (Obj. 7).

## Procedure for Upcoming Session
1. Recruit one host and five students with COMP103 background.  
2. All participants complete the tutorial.  
3. All participants complete a solo mode round.  
4. Host creates a multiplayer lobby; students join.  
5. Complete one multiplayer round.  
6. Observers take notes on errors, confusions, and time to complete tasks.  
7. Collect SUS responses immediately after the session (separately for host and students).  
8. Compare outcomes with success objectives to identify gaps.  

## Next Steps
- Conduct SUS survey after walkthrough.  
- Analyze data against objectives 1–7.  
- Iterate on UI/UX improvements before next testing round.

