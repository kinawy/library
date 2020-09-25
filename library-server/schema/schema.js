const graphql = require("graphql");
const Tutorial = require("../models/Tutorial");
const Language = require("../models/Language");
require("dotenv").config();
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

// dummy data
/* let languageData = [
  { name: "Data Objects", genre: "classes", id: "1", languageID: "1" },
  {
    name: "Object Oriented Programming",
    genre: "front end",
    id: "2",
    languageID: "1",
  },
  { name: "Advanced Mutations", genre: "back end", id: "3", languageID: "2" },
  { name: "NodeJS", genre: "classes", id: "4", languageID: "2" },
  {
    name: "GraphQL for Beginners",
    genre: "front end",
    id: "5",
    languageID: "3",
  },
  { name: "Control Flow", genre: "back end", id: "6", languageID: "3" },
];
let languages = [
  { name: "Javascript", id: "1" },
  { name: "C++", id: "2" },
  { name: "React", id: "3" },
]; */
const TrainingType = new GraphQLObjectType({
  name: "TrainingType",
  fields: () => ({
    /* we use functions to wrap this into so that it only executes when called on and we do not get errors when code reads top to bottom */
    // videos tutorials and training
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    link: { type: GraphQLString },
    languageId: { type: GraphQLString },
    whichLanguage: {
      type: LanguageType,
      resolve(parent, args) {
        /* return _.find(languages, { id: parent.languageID }); */
        return Tutorial.findById(parent.languageID);
      },
    },
  }),
});
const LanguageType = new GraphQLObjectType({
  name: "LanguageType",
  fields: () => ({
    // language types
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    tutorials: {
      type: new GraphQLList(TrainingType),
      resolve(parent, args) {
        /* return _.filter(languageData, { languageID: parent.id }); */
        return Language.findById({ languageID: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // root query for all tutorials, vids, etc
    languageTraining: {
      type: TrainingType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db
        /* return _.find(languageData, { id: args.id }); */
        return Tutorial.findById(args.id);
      },
    },
    // query for languages
    whichLanguage: {
      type: LanguageType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        /* return _.find(languages, { id: args.id }); */
        return Language.findById(args.id);
      },
    },
    allTutorials: {
      type: new GraphQLList(TrainingType),
      resolve(parent, args) {
        /* return languageData; */
        return Tutorial.find({});
      },
    },
    allLanguages: {
      type: new GraphQLList(LanguageType),
      resolve(parent, args) {
        /* return languages; */
        return Language.find({});
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addLanguage: {
      type: LanguageType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        const language = new Language({
          name: args.name,
        });
        return language.save();
      },
    },
    addTutorial: {
      type: TrainingType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        link: { type: GraphQLString },
        languageId: { type: GraphQLString },
      },
      resolve(parent, args) {
        const tutorial = new Tutorial({
          name: args.name,
          genre: args.genre,
          link: args.link,
          languageId: args.languageId,
        });
        return tutorial.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
