# mod-col

Model&amp;Collection library for frontend. Break entities on your frontend into reusable parts!
The relationship between data, component states, and the actions that affect them is a fundamental and unavoidable layer to manage when building a component or application. Vue does not provide a way to structure and encapsulate data, so most projects use plain objects and implement their own patterns to communicate with the server. This is perfectly fine for small applications, but can quickly become a lot to manage when the size of your project and team increases.

This library takes care of this for you, providing a single point of entry and a consistent API:

Communicating with the server to fetch, save, and delete.
Managing model states like empty, active and saved.
Managing component states like loading, saving, and deleting.
When we started to use Vue more extensively at Figured, we noticed that every team had a slightly different way of doing this, so we decided to develop a standard solution that is flexible enough to accommodate most use cases in a consistent way, while preserving reactivity and testability.

The basic concept is that of a Model and a Collection of models. Data and component state is managed automatically, and CRUD is built-in. A classic example would be a to-do list, where each task would be a model and the list of tasks would be a collection.


