# V2 Module 1 – Student Entry/Exit System

## Goal
Track whether a student is currently inside or outside the hostel using QR scan at the gate.

## Main Flow
- Student goes to gate
- QR is scanned
- System identifies student
- System checks latest hostel movement status
- If currently INSIDE → mark EXIT
- If currently OUTSIDE → mark ENTRY
- Current timestamp is stored automatically
- Optional reason can be stored (home / trip / outside / other)

## Core Requirements
- Auto-capture date and time
- ENTRY and EXIT must be complementary
- Prevent invalid duplicate same-state actions
- Store movement history
- Admin can later use this data to know who is inside/outside

## Scope of this branch
- Movement log model
- Movement scan API
- Basic gate scan UI
- Basic student current hostel status logic

## Out of scope
- Complaints
- Staff management
- Food calculator
- Chat system
- Full analytics dashboard