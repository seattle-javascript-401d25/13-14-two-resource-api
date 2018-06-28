![cf](https://i.imgur.com/7v5ASc8.png) Lab 14: Express and Mongo two resource REST API
======

## Submission Instructions
* Work in a new branch called `lab-14`
* **Keep your work as separate as possible from `lab-13`**
* Set up Travis CI on your repo
* Deploy your app to Heroku 
* Create a pull request from your lab branch branch to your master branch
* Submit on canvas:
  * your original estimate
  * how long you spent
  * a link to your pull request
  * your deployed Heroku URL
  * any other thoughts about how this lab went

## Resources
* [express docs](http://expressjs.com/en/4x/api.html)
* [mongoose guide](http://mongoosejs.com/docs/guide.html)
* [mongoose api docs](http://mongoosejs.com/docs/api.html)

## Feature Tasks  
Continue your work from Lab 13. Refactor your app to utilize the new `modelFinder` middleware demonstrated in lecture. 

## Tests
* Write at least two 409 tests for your routes that would be appropriate for this error. This may mean you will have to put a `unique` flag on one of your schema properties if you haven't done that already in Lab 13. 

## Stretch Goals
* Find and utilize a well-tested npm module that can accomplish the same exact thing that our custom `modelFinder` middleware does
* Find other ways to make your code DRY.
* Research the new [ES7 async/await functionality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), and figure out how you can utilize `async/await` in your test modules in place or Promises. [Jest docs can get you started.](http://jestjs.io/docs/en/tutorial-async.html#async-await)

## Documentation
Add your Travis badge to the top of your README. List all of your registered routes and describe their behavior. Describe what your resouce is. Imagine you are providing this API to other developers who need to research your API in order to use it. Describe how a developer should be able to make requests to your API. Refer to the [PokeAPI docs](https://pokeapi.co/docsv2/#resource-lists) for a good example to follow. 
