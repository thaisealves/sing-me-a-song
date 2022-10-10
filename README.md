<div align="center">
<h1>Sing Me a Song</h1>
</div>

# Description

<div align="center">
<img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" height="200px" alt="Microphone" title="Microphone"/>
</div>
The purpose of this project is to use unit, integration and end to end tests on an already working application. The tests where done with Jest and Cypress. The original project is a plataform to put songs recommendations by their YouTube links.

<div align="center">

  <h3>Built With</h3>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px" alt="Typescript" title="Typescript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px" alt="PostgreSQL" title="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px" alt="Node.js" title="Node.js"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px" alt="Express.js" title="Express.js"/>  
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px" alt="Prisma" title="Prisma"/>
  
</div>

## Features:

- Post a recommendation on the plataform
- Upvote and downvote a recommendation
- Get the last 10 recommendations added
- Get the top 10 recommendations added
- Get a random recommendation from the app

# References

### Post a recommendation

To post a recommendation by the back-end:

```http
POST /recommendations
```

#### Request:

| Body          | Type     | Description                                                       |
| :------------ | :------- | :---------------------------------------------------------------- |
| `name`        | `string`  | **Required and Unique**. The name of the song you're recommending |
| `youtubeLink` | `string` | **Required**. YouTube link from the song                          |

####

---

### Upvote

Getting a upvote for the recommendation

```http
POST /recommendations/:id/upvote
```

#### Request:

| Params | Description                                                 |
| :----- | :---------------------------------------------------------- |
| `id`   | **Required**. Id from the recommendation you want to upvote |

####

---

### Downvote

Getting a downvote for the recommendation

```http
POST /recommendations/:id/downvote
```

#### Request:

| Params | Description                                                   |
| :----- | :------------------------------------------------------------ |
| `id`   | **Required**. Id from the recommendation you want to downvote |

####

---

### Get last 10 recommendations

Seeing the last 10 added recommendations

```http
GET /recommendations
```

#### Response:

```json
[
  {
    "id": 2,
    "name": "Love on the Brain",
    "youtubeLink": "https://www.youtube.com/watch?v=QMP-o8WXSPM&ab_channel=Rihanna-Topic",
    "score": 100
  },
  {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidências",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
  }
]
```

####

---

### Get top recommendations

Seeing the most scored recommendations.

```http
GET /recommendations/top/:amount
```

#### Request:

| Params   | Description                                         |
| :------- | :-------------------------------------------------- |
| `amount` | **Required**. Amount of recommendations to be shown |

#### Response:

```json
[
  {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidências",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
  },
  {
    "id": 2,
    "name": "Love on the Brain",
    "youtubeLink": "https://www.youtube.com/watch?v=QMP-o8WXSPM&ab_channel=Rihanna-Topic",
    "score": 100
  }
]
```

####

---

### Get recommendation by ID

Seeing one recommendation that was required by ID.

```http
GET /recommendations/:id
```

#### Request:

| Params | Description                                     |
| :----- | :---------------------------------------------- |
| `id`   | **Required**. ID of recommendations to be shown |

#### Response:

```json
{
  "id": 1,
  "name": "Chitãozinho E Xororó - Evidências",
  "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
  "score": 245
}
```

####

---

### Get a random recommendation from the application

Seeing one recommendation that the application will choose.

```http
GET /recommendations/random
```

#### Response:

```json
{
  "id": 1,
  "name": "Chitãozinho E Xororó - Evidências",
  "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
  "score": 245
}
```

####

---

### Starting the application for tests:

#### Clone application to machine

```
git clone git@github.com:thaisealves/sing-me-a-song.git
```

#### Run back end

```
npm run dev
```

#### Run front end

```
npm start
```

#### Open cypress, on front end

```
npx cypress open
```

#### Run integration tests, on back end

```
npm test
```

#### Run unit tests, on back end

```
npm run test:unit
```

### Obs.: All the tests are setted to the .env.test file, so it has to be created. If trying to run on .env, you have to create a database by prisma:

```
npx prisma migrate dev
```
