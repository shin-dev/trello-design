# trello-design
Simple Trello Design

## Repository
https://github.com/shin-dev/trello-design

### Main
git@github.com:shin-dev/trello-design.git 

### Wiki
git@github.com:shin-dev/trello-design.wiki.git

### Chrome Webstore
https://chrome.google.com/webstore/detail/trello-design/bddemgibaehjbclgpppopnlcaohlikki

## Branches

- master  
Current version.  
(Released to chrome website)

- develop  
Next version.  
(Merge to master after debugging, and released to chrome website)

- feature/foo  
Additional features.
(Merge pull request into develop)

## Development

```scripts
$ yarn install

# Generate a "dist" directory and watching the src directory files.
$ yarn run dev
```

if you not workings HMR, refer to the following.  
FYI: https://github.com/rubenspgcavalcante/webpack-extension-reloader/issues/98

```
# manifest.json
{
  "background": {
    "scripts": ["scripts/background.js"],
    "persistent": true # required
  }
}
```

also There are two reasons for separating the manifest files.

1. for use HMR in the development environment. (HMR require background specified)
1. popup slowed down when background was specified.

## Release

```scripts
$ yarn install --frozen-lockfile

# Generate a "dist" directory, and generate a "trello-design.zip" in it.
$ yarn run release
```

## License

```
/*
 * © 2020 シン合同会社 - SHIN LLC
 * https://shin-dev.com
 */
```

MIT License
