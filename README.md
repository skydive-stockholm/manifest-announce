<p align="center"><img src="/docs/assets/screenshot.jpg" alt="Screenshot of manifest application"></p>

# Manifest Announcements

Announces load calls both manually and automatically using SkyWin One and AWS Polly. 

**Current loads** and jumpers are fetched from SkyWin.

**Voice** is generated using AWS Polly and is fixed to the voice "Amy" with the neural option.

In case AWS Polly is not available, the application will fallback to using the browser's built-in speech synthesis. This is _not_ recommended as the voice quality is significantly worse. The cost for using AWS Polly is very low and should be considered.

## Prerequisites

* Node.js
* NPM
* Access to SkyWin One API
* AWS account _(optional)_

## Installation

Clone the repository and run `npm install` to install the dependencies.

Build application with `npm run build`.

Your webserver should point to the `dist` directory.

## Usage

To test the application without access to a production SkyWin API, you can use the official SkyWin demo. Set the SkyWin endpoint in settings to `https://demo.skywin.se`.

Visit the demo URL to modify loads to your liking: [SkyWin demo](https://demo.skywin.se)

### Gates

Selecting a gate is optional. 

### Announcements

Enabling "Auto call" will automatically announce the next load whenever it reaches 10 and 15 minutes. 

A bell sound will always play before the announcement. This cannot be turned off.

Enabling "Read names" will read all names of the jumpers in the load. If a group has a name, it will read the group name.

### Custom announcement
A custom message can be announced by typing in the input field and pressing "Play". Bell sound can be turned off here.

### Persistent settings
This application uses local storage to save settings. This means that the settings will be saved between sessions.

## Credits

- [Robin Nilsson](mailto:robin.nilsson@skydive.se)
- [All Contributors](../../contributors)

## License

GNU General Public License v3.0 or later

Please see [LICENSE](LICENSE.md) for full text.
