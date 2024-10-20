# Confluence-to-Markdown Converter

This is a Node.js script that converts Confluence Cloud pages into Markdown format.

It uses Confluence Cloud v2/API to extract pages and their attachments.

It's based on [Turndown](https://github.com/mixmark-io/turndown) to help convert Confluence pages to Markdown.

You can run the script through a terminal or command prompt in your computer.

> **Note**: Most tables are now automatically converted to Markdown format, but there are a few that, for some reason, are returned as HTML tables. 

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer.
- Confluence Cloud access: username (email) and password.
- Obtain a [Confluence API token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

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

### III. Create the `config.toml` file

1. Use a text editor to create a `config.toml` file.
2. Obtain the following data:
   - Confluence username (email)
   - [Confluence API token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
   - Base URL of the pages you will be extracting in the corresponding lines.
3. Insert the data in the `config.toml` file following this structure:
```toml
username = "name@company.com"
password = "YOUR_API_TOKEN"
base_url = "https://company.atlassian.net/wiki"
```
4. Save the `config.toml` file in the folder the Confluence-to-Markdown Converter is stored on you computer.

## Usage

### Converting individual pages or a series of pages

1. From the terminal, and within the program's folder, run the following command:

    ```shell
    node conf2md.js
    ```

2. When prompted, insert the Confluence page ID number of each the pages you wish to convert and press **Enter** after each one (press **Enter** with no value to finish).

    > **Note**: The ID number is found in the the URl of Confluence page you want to convert.

3. The program automatically creates the `./imports` folder and stores in it the newly created markdown files. 
   
4. You will find all attachments in the `./imports/media` folder.

### Converting all the pages within a Confluence space

1. From the terminal, and withing the program's folder, run the following command:
   
   ```shell
   node conf2mdBySpace.js
   ```

2. When prompted, type the Confluence space key and press **Enter**.
   
   > **Note**: The Confluence space key is automatically generated that can be found in **Space settings > Space details > Key**.  
   > You can also find the key in the Confluence space's URL. it's a set of capital letters resembleing the initials of the space name.

3. The script will automatically store the converted pages in `./imports` folder.
4. You will find all the attachments i the `./imports/media` folder.
