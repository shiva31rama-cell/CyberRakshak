# Bug Reports

## Bug 1: Login Authentication Failure

**Module:** Login

**Severity:** High

**Description:**
The application allows users to log in using an email address that has not been registered. User credentials are not validated before granting access, resulting in unauthorized login.

**Expected Result:**
Only registered users with valid credentials should be able to log in.

**Actual Result:**
The application allows login with unregistered email addresses.

**Status:** Open

---

## Bug 2: AI Chatbot UI Issue

**Module:** AI Chatbot

**Severity:** High

**Description:**
The chatbot window opens correctly, but when the user clicks inside the message input field, the chat window immediately closes and returns to the chatbot icon. This prevents users from interacting with the chatbot.

**Expected Result:**
The chatbot should remain open and allow users to type and send messages.

**Actual Result:**
The chatbot closes automatically when the input field is clicked.

**Status:** Open
