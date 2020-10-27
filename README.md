# Email signature web part

This web part allows users to copy their company's branded email signature and
paste it into their email client.

![Screenshot of email signature web part](/assets/screenshots/Preview.png)

This web part is licensed under MIT.


## Features

- Content authors can add their own HTML template for email signatures.
- Web part automatically pulls contact information from Microsoft Graph and
  fills in the template. This requires permitting the app to *User.ReadBasic.All*
  API permissions.
- Users can optionally edit all the values.
- Custom properties can be added to the web part and be made optionally editable
  by the user.
- Profile photos can be pulled in, and optionally be made round.


## Installation

1. Download the [latest](https://github.com/habaneroconsulting/spfx-email-signature/releases/latest)
   `.sppkg` release.
2. Go to your SharePoint's tenant [app catalog](https://docs.microsoft.com/en-us/sharepoint/use-app-catalog).
3. Upload the *email-signature-web-part-{version}.sppkg* package.
4. Determine whether or not the client-side solution should be made available to
   all sites in the organization ([tenant wide](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/extensions/basics/tenant-wide-deployment-extensions)).
   Note that this solution will require additional permissions and informs you
   that it will request *User.ReadBasic.All* from Microsoft Graph.
5. Click *Deploy* to deploy the solution.
6. In the *SharePoint admin center*, go to the *[API access](https://docs.microsoft.com/en-us/sharepoint/api-access)*
   page and approve the new Microsoft Graph API access request.
7. **(Optional):** If in step #4, the solution was not made tenant wide, go to
   the site that the web part should be placed on. In the *Site Contents*, add
   the new *spfx-email-signature-web-part-client-solution* app.
8. Go to a page in your SharePoint site and add the *Email signature* web part.
9. Edit the web part properties to add your custom email signature.
10. Publish the page and test.


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
