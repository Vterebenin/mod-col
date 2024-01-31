# mod-col

[Model&amp;Collection](https://github.com/Vterebenin/mod-col) library for frontend. Break entities on your frontend into reusable encapsulated parts!

## Notes for readers:

- This library is, in fact, WIP. Probably a lot will change in the future;
- Currently this library is used by very few project and will highly depend on their needs;
- Contributions are very welcomed!
- we were pretty much inspired with [vuemc](https://vuemc.io/)

## The problem 

If you ever worked on an application that has many entities (a.k.a. models), or with just large codebase, you probably end up with creating your implementations of Models and Collection. These concepts have many things in common. For instance, validations, request on backend and operations with arrays and entities, etc. On frontend, especially, frameworks like vue, react, etc does not provide a solution to scale, structure and encapsulate your models and collection. Implementation grows as the project grow and your ways to make it probably will lead to tech debt. 

## The solution

Modcol will give you a nice start to create your own models and encapsulate logic.

The features:
- Communicating with the server by defining apiFunctions().
- Managing model validations: create your own set of rules and run them with .validate().
- Managing component states like loading.
- Easily add/override/remove/clone/etc your models from a collection.
- todo: add more features

Keep in mind, that the concept is very straigthforward: There is some *Model* and a *Collection* of those *Models*. And they communicate with each other. 

For instance `Book` is a model and a `Bookshelf` is a collection. Another great example is that `TodoList` is a collection and `Task` from `TodoList` is a model.

## Motivation from creators

You can not only use this as a library, but also as a source of inspiration of creating your own models that correlate with your codebase more. Just pass trough the examples and if its not working for your mental models, try to create your own for fun!

Other than that, this is a great tool to create models and collections. Extend your classes from `BaseModel` and `BaseCollection`, then fill in required fields and add your methods. Some method not working for one of your classes? Override them!

## Installation

Install with your favourite package manager like so:

```
npm i --save mod-col
```

Then use it like so: 
