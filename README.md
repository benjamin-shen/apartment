# Apartment App

This website is built with React and hosted at [apt.benjaminshen.com](https://apt.benjaminshen.com).

This project is open-source. Forks and contributions are welcomed.

<!-- TODO firestore rules, manual database additions -->

## Getting Started

1. Clone the repo. Duplicate `src/exampleEnv.json` and `functions/exampleEnv.json` and rename the files to `env.json` in their respective folders.
2. Edit `app.name` and `app.address` in `src/env.json`.
3. Follow the instructions under [Firebase](#firebase).
4. Follow the instructions under [Gmail](#gmail) and [GroupMe](#groupme).

### Firebase

This section is essential for setting up the app by yourself. Firebase is used for its hosting, authentication, cloud functions, and cloud firestore.

1. Create a new Firebase project. Upgrade the project to the Blaze plan to use Cloud functions.
2. Work in the top-level folder of the cloned repo. Log in to your newly created project using the [Firebase CLI](https://firebase.google.com/docs/cli). Run `firebase use --add`, select your project id, and name it "default".
3. Create a new app in the Firebase console. Make sure to set up Firebase Hosting for the app.
4. Follow the instructions under [Hosting](#hosting).
5. In the Firebase console's Settings > General, under your newly created app, copy the config object to `firebase.config` in `src/env.json`.
   The config object looks like
   ```
   const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...,
    measurementId: "..."
   };
   ```
   Copy the json object and convert it into a hash by replacing the keys with string literals.
6. Follow the instructions under [Admin](#admin).
7. Follow the instructions under [Authentication](#authentication).
8. Run `firebase deploy` in the top-level folder to deploy all of the features. You can now view the project where it is hosted.

#### Hosting

1. If you want to host your app on a custom domain, click "Add Custom Domain" in the Hosting tab in the Firebase console and follow the instructions.
2. Copy your app's url to `app.url` in `functions/env.json`.

#### Admin

1. In the Firebase Console's Settings > Service accounts, click "Generate new private key" and copy the contents to `firebase.credentials` in `functions/env.json`.
2. Edit `firebase.databaseUrl` in `functions/env.json`. This should just be the same as `firebase.config.databaseURL` in `src/env.json` ("https://`<project-id>`.firebaseio.com").

#### Authentication

1. Set up email authentication on the Firebase console and manually add users for you and your housemates. Add their UIDs as a string list field to `app/private` in Firestore.
2. Pick a guest password that your guests can sign up with, and write it to `app.guestPassword` in `functions/env.json`.
3. Customize your email templates in the firebase console.

### Gmail

This section is for sending doorbell notifications via Gmail.

1. Log in to your Google account, navigate to your Security tab, turn on "Less Secure Apps." If you still run into issues with the cloud function, try [clearing the Captcha](https://support.google.com/mail/thread/32840224?hl=en).
2. Edit `gmail.auth.user` and `gmail.auth.pass` in `functions/env.json` with your email address and password. Edit `gmail.sender` with the sender's display name. Edit `gmail.recipients` with a list of email recipients (eg. your housemates).

### GroupMe

This section is for sending doorbell notifications in a GroupMe chat. If you don't have a GroupMe account or don't want to use GroupMe, you can skip this section.

1. Go to [dev.groupme.com](https://dev.groupme.com). Log in and copy your access token to `groupme.auth_token` in `functions/env.json`.
2. [Create a new bot](https://dev.groupme.com/bots) in your house group chat. If you don't have a group chat, you can create a new one on the Groupme app.
3. Copy the bot id to `groupme.bot_id` in `functions/env.json`.

## Contributing

Before starting to work on the project, make sure to run `yarn install` in the top-level folder and `npm install` in `functions/`.

### Frontend

All of the frontend code is in `public/` and `src/`. To host the frontend locally, run `yarn start`. Run `yarn build` to build the distribution code (in `build/`) from React.

#### Deploy

Run `yarn deploy` to build the frontend and deploy all the Firebase features. Append `--only <feature>` to only deploy that feature (eg. `yarn deploy --only hosting`).

### Backend

All of the backend code is in `functions/src/`. To host the backend locally, run `npm run shell` in the `functions/` folder. In `src/components/base.js`, uncomment the functions emulator line. Remember to comment it before deploying!

#### Deploy

Run `npm run deploy` in the `functions/` folder to deploy all of the cloud functions. To deploy a specific function, run `firebase deploy --only functions:<functionName>` (eg. `firebase deploy --only functions:doorbell`).
