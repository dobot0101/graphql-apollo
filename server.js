import { ApolloServer, gql } from 'apollo-server'

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2"
  },
  {
    id: "2",
    text: "second one",
    userId: "1"
  }
]

let users = [
  {
    id: "1",
    firstName: "dohyun",
    lastName: "lee"
  },
  {
    id: "2",
    firstName: "dohyun",
    lastName: "lee"
  },
  {
    id: "3",
    firstName: "dohyun",
    lastName: "lee"
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    allUsers: [User!]!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`

const resolvers = {
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId)
    }
  },
  Query: {
    allTweets() {
      return tweets
    },
    tweet(root, args) {
      return tweets.find(tweet => tweet.id === args.id)
    },
    allUsers() {
      return users
    }
  },
  Mutation: {
    postTweet(__, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text: text,
        userId: userId
      }
      tweets.push(newTweet)
      return newTweet
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id)
      console.log(tweet)
      if (!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id)
      return true;
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`)
})