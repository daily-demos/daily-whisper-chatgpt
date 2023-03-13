# **Meeting Transcription and Summary Demo App**

This is a demo app that uses OpenAI Whisper and ChatGPT, Daily's video APIs, and Node mailer to automatically transcribe a meeting and generate a meeting summary.

## **Installation**

To get started, clone this repository and set the following environment variables:

- **`DAILY_API_KEY`**: Your Daily.co API key
- **`EMAIL_SUMMARY`**: The email address where the meeting summary will be sent
- **`NEXT_PUBLIC_ROOM_URL`**: The URL of the Daily.co room where the meeting will be held
- **`ROOM_NAME`**: The name of the Daily.co room where the meeting will be held
- **`OPENAI_API_KEY`**: Your OpenAI API key
- **`SERVER_URL`**: The URL of your server where the app will be hosted

## **Usage**

1.Install dependencies with **`yarn`**.
2. Start the app by running **`yarn dev`**.
3. Join the Daily.co room using the **`NEXT_PUBLIC_ROOM_URL`** environment variable.
4. The app will automatically transcribe the meeting using OpenAI Whisper and ChatGPT.
5. After the meeting, the app will generate a meeting summary and log the preview email to the console for to the email address specified in the **`EMAIL_SUMMARY`** environment variable.

## **Obtaining Daily API Credentials**

To obtain your Daily API credentials, follow these steps:

1. Go to **[https://dashboard.daily.co/developers](https://dashboard.daily.co/developers)**.
2. Sign up for a Daily.co account if you haven't already.
3. Create a new API key.
4. Copy the API key and use it as the **`DAILY_API_KEY`** environment variable.

## **Obtaining OpenAI API Credentials**

To obtain your OpenAI API credentials, follow these steps:

1. Go to **[https://beta.openai.com/signup/](https://beta.openai.com/signup/)**.
2. Sign up for an OpenAI account if you haven't already.
3. Create a new API key.
4. Copy the API key and use it as the **`OPENAI_API_KEY`** environment variable.

## **License**

This app is licensed under the MIT license. See the **`LICENSE`** file for more details
