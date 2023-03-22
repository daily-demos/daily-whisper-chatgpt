# **Meeting Transcription and Summary Demo App**

This is a demo app that uses OpenAI Whisper and ChatGPT, Daily's video APIs, and Node mailer to automatically transcribe a meeting and generate a meeting summary.

## **Installation**

To get started, clone this repository and set the following environment variables copy **`Sample.env`** and change it to **`.env.local`**:

- **`DAILY_API_KEY`**: Your Daily API key
- **`NEXT_PUBLIC_ROOM_URL`**: The URL of the Daily room where the meeting will be held
- **`OPENAI_API_KEY`**: Your OpenAI API key
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
5. Select the recording button to begin recording. OpenAI's whisper model has a 25MB file limit. In this demo recording longer meetings will result in an error.
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

## **Obtaining SMTP Credentials from Sendinblue**

To obtain SMTP credentials from Sendinblue, follow the below steps. Note that you can use any SMTP service you desire, but Sendinblue has a generous free plan that works well for demoing the repo.

1. Go to [Sendinblue](https://www.sendinblue.com/) and create an account or Log in.
2. In the dashboard, click on the "SMTP & API" tab in the left sidebar.
3. Click on the [SMTP & API](https://app.sendinblue.com/settings/keys/smtp) and then click on the "Create a new SMTP key" button.
4. Enter a name for your SMTP key and click on the "Create" button.
5. Once your SMTP key is created, you can view the SMTP server, SMTP port, SMTP login, and SMTP password by clicking on the "View" button next to your key name.

## **License**

This app is licensed under the MIT license. See the **`LICENSE`** file for more details
