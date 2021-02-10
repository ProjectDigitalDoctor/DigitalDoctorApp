# DigitalDoctor App

This app is a prototype of an app for digital doctor appointments, prescriptions and medical certificates.
It has been built for the "Mobile Software Engineering" course at the HS Mannheim.

The app is built in React Native and is to be used together with the [DigitalDoctor Backend Server](https://github.com/ProjectDigitalDoctor/DigitalDoctorBackend).

**It only has been tested with Android!**

## Getting started

### Install the APK file

A pre-packaged [apk file](android/app-release.apk) that can be installed on an Android Device is located in the android folder.

### Compile & Run the App yourself

- Follow the React Native [guide](https://reactnative.dev/docs/environment-setup) for
	- Installing NPM
	- Installing the Android SDK
	- Setting up the Android Development Environment
	- Preparing an Android Device
- Install [yarn](https://yarnpkg.com/getting-started/install)
- Clone this repository
- Run `yarn` inside the cloned folder. This downloads all needed dependencies.
- Run `yarn react-native run-android` to compile the app and start it on your set up Android Device

## Connectivity to the backend

The pre-packaged APK and the default in the code accesses the backend under https://digitaldoctor.max-heidinger.de.
This URL should be available at least until April 2021.

If this backend is no longer available or you want to use your own instance, change the location of the backend in the [api config file](app/api/config.ts). 

If you visit the root path of the backend URL, you can create different entities inside the system and create/join video calls to demo doctor interactions.
Video calls always have to be started by this page first before the app can join too!