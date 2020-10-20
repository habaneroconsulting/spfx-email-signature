# Email signature web part

This web part allows users to copy their company's branded email signature and
paste it into their email client.

![Screenshot of email signature web part](/assets/screenshots/Preview.png)

This web part is licensed under MIT.


## Features

- Content authors can add their own HTML template for email signatures.
- Web part automatically pulls contact information from Microsoft Graph and
  fills in the template.
- Users can optionally edit all the values.
- Custom properties can be added to the web part and be made optionally editable
  by the user.
- Profile photos can be pulled in, and optionally be made round.


## Building

This web part is built with the [SharePoint Framework (SPFx)](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/overview-client-side-web-parts).
It can be cloned and built using the normal SPFx `gulp` tasks, or by using the
following npm scripts:

- `npm run serve:browser` to start a local development server using SharePoint
  Workbench and mock data.
- `npm run serve` to start a local development server to run against a real
  SharePoint environment
- `npm run dist` to create a production build and package


### Version numbering

Multiple areas of the code base need to be updated when making a version number
change. This has been automated in a preversion script, so using `npm vesrion`
is required.


## Testing

This web part uses `jest` and `react-testing-library` for its tests. Due to
limitations with SPFx's `react-dom` version and `react-testing-library`, this
library has upgraded `react` and `react-dom` to 16.9.0.

Run the tests with `npm test`.
