# Confluence-to-Markdown Converter

Converts Confluence Cloud pages into Markdown format.

Uses Confluence Cloud v2/API to extract pages and their attachments. Confluence API token required.

Based on [Turndown](https://github.com/mixmark-io/turndown).

## Usage

Run:
```shell
node conf2md.js
```

When prompted, insert Confluence page ID number.
> **Note**: The ID number is found in the the Confluence page's URL.

The new markdown file will be stored in the `./imports` folder.  
All attachments are stored in the `./imports/media` folder.
