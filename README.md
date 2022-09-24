# Chrono

Pseudo [Harvest](https://www.getharvest.com/) clone. This project was made with learning purposes.

It tries to replicate the main features of Harvest and also adds some extra ones that I considered interesting and amusing ;) like selecting a background image and a thumbnail image.

## Getting Started

This project uses [Auth0](https://auth0.com/) in order to handle both user authentication and profile editing. It also uses [MongoDB](https://www.mongodb.com/) as the persistence layer.
Make sure you have defined every needed environment variable. You can find an example in this file `.env.example`.

You should run `yarn prepare` command in order to enable [husky](https://www.npmjs.com/package/husky).

Then, run the development server:

```bash
yarn dev
```

If you prefer to run MongoDB in the terminal, open a background console

```bash
mongod
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Main Features and Characteristics

- Allows to CRUD tasks with a title and a description, persisting them in a non-relational database as MongoDB.
- i18n (en, es).

## Considerations

1. The whole backend logic that we can found in the pages/api folder should be isolated in a separate service/api in order to follow the separation of concern principle. For the sake of simplicity, this project groups everything in the same app (:

## Author

[Ignacio Miranda Figueroa](https://www.linkedin.com/in/ignacio-miranda-figueroa/)

## License

[MIT](LICENSE)
