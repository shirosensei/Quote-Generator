
# Quote API Web App Generator (CRUD) 

The Quote API Web App Generator is a web application that allows users to generate and manage quotes. 
It leverages an external API to fetch a "Quote of the Day" and provides features such as dark and light modes, generating new quotes, and the ability to store quotes in a MongoDB database. 



<img src="https://github.com/shirosensei/Quote-Generator/blob/main/Animation.gif" alt="Project Demo" width="400">

Here's an overview of its functionality:


## Features

- Light/dark mode toggle
- Live previews
- Daily Quote
- Search Tags
- Chatbot for random quotes daily via messaging and email


**User Interface:**

The application provides a clean and intuitive user interface where users can interact with various features.

It includes options for switching between dark and light modes, ensuring a visually appealing experience.

The UI displays the current "Quote of the Day" and provides buttons to generate new quotes and manage stored quotes.

**Quote of the Day:**

The application fetches a "Quote of the Day" from an external API. This quote is selected and updated every 24 hours.

The fetched quote is displayed prominently in the UI, providing users with daily inspiration or thought-provoking messages.

Generating New Quotes:

Users can generate new quotes on-demand by clicking a button in the UI.
The application sends a request to the external API to fetch a random quote, which is then displayed to the user.
This feature allows users to explore and discover new quotes beyond the daily "Quote of the Day."

**Quote Storage and Management:**

The application offers functionality to store and manage quotes in a MongoDB database.
Users can choose to store a quote they find interesting or want to remember for later.
Stored quotes can be viewed, updated, or deleted within the application's interface, enabling CRUD (Create, Read, Update, Delete) operations.

**Subscription to Daily Quote:**

Users have the option to subscribe to receive a daily quote via email.
By providing their email address and subscribing, users will receive the daily "Quote of the Day" in their inbox.
This feature ensures that users can continue to receive inspirational or thought-provoking quotes even outside the application.


## Documentation

[Documentation](https://linktodocumentation)


## Installation

Install with npm

```bash
  cd quote-generator
    npm install
```
    



