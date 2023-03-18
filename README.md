# **Meeting Transcription and Summary Demo App**

This is a demo app that uses OpenAI Whisper and ChatGPT, Daily's video APIs, and Node mailer to automatically transcribe a meeting and generate a meeting summary.

## **Installation**

To get started, clone this repository and set the following environment variables copy **`Sample.env`** and change it to **`.env.local`**:

- **`DAILY_API_KEY`**: Your Daily API key
- **`NEXT_PUBLIC_ROOM_URL`**: The URL of the Daily room where the meeting will be held
- **`OPENAI_API_KEY`**: Your OpenAI API key
- **`SERVER_URL`**: The URL of your server where the app will be hosted
- **`SMTP_SERVER`**: The SMTP server from your email service
- **`SMTP_PORT`** : The SMTP port from your email service
- **`SMTP_LOGIN`** : The SMTP login from your email service
- **`SMTP_PASSWORD`** : The SMTP password from your email service
- **`EMAIL_SUMMARY`**: The email address where the meeting summary will be sent

## **Usage**

1. Install dependencies with **`yarn`**.
2. Start the app by running **`yarn dev`**.
3. The app should now be running on **`http://localhost:3000`**.
4. Join the Daily room using the **`NEXT_PUBLIC_ROOM_URL`** environment variable.
5. Select the recording button to begin recording. Open AI's whisper model has a 25MB file limit, in this demo recording longer meetings will result in an error.
6. Once the recording is stopped the app will automatically transcribe the meeting using OpenAI Whisper and ChatGPT.
7. After the meeting, the app will generate a meeting summary and send an email to the **`EMAIL_SUMMARY`** environment variable.

## **Obtaining Daily API Credentials**

To obtain your Daily API credentials, follow these steps:

1. Go to **[https://dashboard.daily.co/developers](https://dashboard.daily.co/developers)**.
2. Sign up for a Daily account if you haven't already.
3. Create a new API key.
4. Copy the API key and use it as the **`DAILY_API_KEY`** environment variable.

## **Obtaining OpenAI API Credentials**

To obtain your OpenAI API credentials, follow these steps:

1. Go to **[https://beta.openai.com/signup/](https://beta.openai.com/signup/)**.
2. Sign up for an OpenAI account if you haven't already.
3. [Create a new API key](https://platform.openai.com/account/api-keys).
4. Copy the API key and use it as the **`OPENAI_API_KEY`** environment variable.

## **License**

This app is licensed under the MIT license. See the **`LICENSE`** file for more details
