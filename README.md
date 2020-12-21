# Did the rocket launch yet?
## Introduction
We have a video of a rocket launch and we want to know at which frame exactly is the rocket launched. This solution provides a Telegram bot, which help you to find the frame we are looking for.
## Features
- Full [Telegram Bot API 5.0](https://core.telegram.org/bots/api) support
- Support several chats
- Javascript typing
- Easy to extend
## Installation
1. `$ npm install`

2. Edit .env: `BOT_TOKEN: xxxxxxxxxxxx`

3. Redis required. Default URL in localhost and editable in .env as `REDIS_URL`. More info about how install redis in the next [link](https://redis.io/topics/quickstart).
## Run
`$ npm run start`
## Structure
* **src\\** 
  - **commands\\** : Manage bot commands
  - **config\\** : Regarding the configuration of the solution
  - **controllers\\** : Manage the main controller/s
  - **helpers\\** : Manage other services
  - **resources\\** : Regarding static resources have to use the solution
  - **utils\\** : Manage auxiliary methods  
* **.env** : environmental variables
* **.eslintrc & .prettierrc** : code analysis and formatter
