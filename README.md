# Apartment App

This website is built with React and hosted at [apt.benjaminshen.com](https://apt.benjaminshen.com).

## Guide

This project is open-source. Forks and contributions are welcomed.

## Getting Started

1. Clone the repo. Duplicate `src/exampleEnv.json` and `functions/exampleEnv.json` and rename the files to `env.json` in their respective folders.
2. Edit `app.name` and `app.address` in `src/env.json`. 
3. Follow the instructions under [Firebase](#firebase).
4. Follow the instructions under [Gmail](#gmail) and [GroupMe](#groupme).

### Firebase

This section is essential for setting up the app by yourself. Firebase is used for its hosting, authentication, cloud functions, and cloud database.

1. Create a new Firebase project. Upgrade the project to the Blaze plan to use Cloud functions.
2. Work in the top-level folder of the cloned repo. Log in to your newly created project using the [Firebase CLI](https://firebase.google.com/docs/cli). Run `firebase use --add`, select your project id, and name it "default".
3. Create a new app in the Firebase console. Make sure to set up Firebase Hosting for the app.
4. Follow the instructions under [Hosting](#hosting).
4. In the Firebase console's Settings > General, under your newly created app, copy the config object to `firebase.config` in `src/env.json`.
5. Follow the instructions under [Admin](#admin).
6. Follow the instructions under [Authentication](#authentication).
7. Run `firebase deploy` in the top-level folder to deploy all of the features. You can now view the project where it is hosted.

#### Hosting
1. If you want to host your app on a custom domain, click "Add Custom Domain" in the Hosting tab in the Firebase console and follow the instructions.
2. Copy your app's url to `app.url` in `functions/env.json`.

#### Admin
1. In the Firebase Console's Settings > Service accounts, click "Generate new private key" and copy the contents to `firebase.credentials` in `functions/env.json`.
2. Edit `firebase.databaseUrl` in `functions/env.json`. This should just be the same as `firebase.config.databaseURL` in `src/env.json` ("https://<project-id>.firebaseio.com").

#### Authentication
1. Set up email authentication on the Firebase console and manually add users for you and your housemates. Copy these uids to `app.uids` in `src/env.json`.
2. Pick a guest password that your guests can sign up with, and write it to `app.guestPassword` in `functions/env.json`.

### Gmail

This section is for sending doorbell notifications via gmail.

(WIP)

### GroupMe

This section is for sending doorbell notifications in a GroupMe chat. If you don't have a GroupMe account or don't want to use GroupMe, you can skip this section.

(WIP)

## Scripts

(WIP)
