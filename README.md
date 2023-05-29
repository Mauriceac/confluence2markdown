# Confluence-to-Markdown Converter

Converts Confluence Cloud pages into Markdown format.

Uses Confluence Cloud v2/API to extract pages and their attachments.

Based on [Turndown](https://github.com/mixmark-io/turndown) to convert Confluence pages to Markdown.

## Prerequisites

- Node.js installed
- Confluence Cloud access
- Confluence API token

## Setup

### I. Clone or download the repository

1. Create a folder in your computer to store the Confluence-to-Markdown Converter files.
2. Choose any method to copy the files in this repository into the folder in your computer.

### II. Install dependencies

1. Open a terminal and ensure that you are on the folder where the files are now stored.
2. From the terminal, run the following command to install external libraries:

```shell
npm install
```

### III. Configure the `config.toml` file

1. Use a text editor to create a `config.toml` file.
2. Put your Confluence credentials and base URL of the pages you will be extracting in the corresponding lines.
3. Save the `config.toml` file in the folder the Confluence-to-Markdown Converter is stored on you computer.

Example:

```toml
username = "name@company.com"
password = "YOUR_API_TOKEN"
base_url = "https://company.atlassian.net/wiki"
```


## Usage

1. From the terminal, run the following command:

```shell
node conf2md.js
```

1. When prompted, insert Confluence page ID number of the pages to convert and press **Enter** after each (press **Enter** with no value to finish).

    > **Note**: The ID number is found in the the URl of Confluence page you want to convert.

2. The new markdown files will be stored in the `./imports` folder. All attachments are stored in the `./imports/media` folder.
