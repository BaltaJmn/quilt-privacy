# quilt-privacy

The privacy policy for **Quilt**, an annual habit tracker for Android and iOS.

`index.html` is the whole site: one page, English and Spanish, no dependencies.
It is here because Google Play will not publish an app without a privacy policy
on a public URL that does not ask for a login.

Served at <https://baltajmn.github.io/quilt-privacy/>.

## Keeping it true

The policy is written against what the app actually does, not from a template.
It states that Quilt has no accounts and no server, that habits never leave the
device, and that the only data that does leave is the anonymous purchase state
held by RevenueCat.

Adding an analytics SDK, calling `Purchases.logIn()`, or requesting a new
permission makes this document false. Any of those means editing this page and
redoing the Data Safety form in Play Console.

The source of truth lives with the app, in `store/privacy/index.html`. Edit it
there, then copy it here — otherwise the two drift and the published one wins.

Nothing private is published here: no source, no keys, no user data.
