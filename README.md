# Team-7
CSC4350 Team 7 repo
Use Case Diagram 
Team 7 
Members: Damilare Soyomokun, Nick Johnson, Bhavya Patel, Sami Berhan
________________________________________
 Use Case Diagram Description
Actors:
1.	Registered User
2.	System (Automated Services / API Layer)
3.	Admin (Optional / Future Feature)
Use Cases per Actor:
Registered User:
•	Register / Login
•	Link Bank / Wallet / Crypto Account
•	Add Manual Transaction
•	Categorize Transactions
•	View Dashboard / Reports
•	Set Financial Goals
•	Track Debts
•	Manage Subscriptions & Alerts
System:
•	Sync Transactions via API (Plaid)
•	Fetch Account Balances
•	Trigger Alerts (Low Balance, Bills, Goal Milestones)
•	Send Notifications
•	Auto-update Recurring Transactions
Admin (Optional):
•	Monitor User Activity
•	Review System Logs
•	Manage API Integrations
________________________________________

<img width="940" height="763" alt="image" src="https://github.com/user-attachments/assets/0e36cf73-9092-44c9-b923-00bd4682ef90" />

📋 Use Case Diagram (Visual Description Format)
 ________________________________________
📅 Functional Requirements
ID	Requirement
FR1	Users shall register and log in securely
FR2	Users shall link financial accounts via Plaid
FR3	Users can manually add/edit/delete transactions
FR4	Users can categorize transactions
FR5	The system shall show income vs. expenses via charts
FR6	Users can set and track savings or debt goals
FR7	The system shall trigger alerts (low balance, bills, milestones)
FR8	The system shall fetch and update account balances automatically
________________________________________
🌐 Non-Functional Requirements
ID	Requirement
NFR1	The system must support 99.9% uptime
NFR2	All sensitive data must be encrypted (SSL, tokenized, etc.)
NFR3	The UI must be responsive and accessible on mobile & web
NFR4	Dashboard must load in under 3 seconds
NFR5	System should scale to support 10,000+ concurrent users
________________________________________

