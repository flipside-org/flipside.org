---
layout: note
notes_active : false

title: Incendios.pt - under the hood
category: note
image: incendios-pt_map.png
tags: node.js, MongoDB, MVC

user: nunoveloso
---

Being incendios.pt a fairly simple site in terms of content and structure, FlipSide wanted to spice it up, taking the opportunity to use and learn new technologies. Being traditionally a Drupal-oriented company, using any similar CMS or CMF wouldn't add too much value to our skillset. At first, Jekyll (that powers this site) was considered, but dropped almost instantly as - again - we already know it! The idea was to use a state-of-the-art, fast growing tech.

The main point was to remain faithful to the "use the right tool for the job" philosophy. So, we wanted to serve similarly structured pages with dynamic content, have a mini, internal JSON API and be able to fully control the final display. Yup, that smells like pure MVC there. So the choice was easy: [Express.js](http://expressjs.com) to the rescue! And to complemente that, since we previously had a [very satisfactory experience with MongoDB](http://flipside.org/notes/data-collection-with-airwolf), we've decided to add it to the stack.

All in all, the combination MongoDB + Express.js would be a great bootstrap for the initial prototype, that could then be re-used for the final application.


# Importing the data into MongoDB

The processed data was in CSV format [link to Olaf's post about data processing!], `mongoimport` was just perfect to get the data into the database. Then, a mix of `mongo shell scripts` (written in pure JS) helped manipulating the flat JSON into a structured one, adding proper indexes, and adjusting some other details.

This is very convenient to create a set of commands that would simply reset your database and start fresh within seconds. Also, because of the nature of MongoDB, it would be extremely easy to add new fields to all objects, or perform other bulk data handling. As an experimental prototype, it's exactly the flexibility needed.


# Easy win with Express.js

Express.js is a web application framework for node.js, oriented to build web applications, APIs, and services. But it wasn't our first, natural choice. The initial research lead to [Compund.js](http://compoundjs.com/) (which is based on Express.js). But after the first prototyping, we quickly realised that we were using more direct features from Express.js than using any benefist of Compound.js, so we cut an extra level of the stack, and stuck to Express.js.

Module-wise, we used, amongst other:
- *[ejs](https://npmjs.org/package/ejs)* and *[ejs-locals](https://npmjs.org/package/ejs-locals)* for templating, and sub-templates.
- *[mongoose](https://npmjs.org/package/mongoose)* to connect to MongoDB.
- *[moment](https://npmjs.org/package/moment)* for ease of date handling.
- *[async](https://npmjs.org/package/async)*, because sometimes you need to control the flow of code execution.
- *[i18n](https://npmjs.org/package/i18n)* for internationalisation.
- *[konphyg](https://npmjs.org/package/konphyg)* for easy, portable configuration of the app.

For each main collection in MongoDB, we created a model file, to handle *Mongoose* object structure, indexes, and helper functions (mainly loaders, and lists). Then we did the same for controllers; also adding controllers for more abstract concepts, such as the front page. Finally, the views were all handled by cascading templating (using *ejs*). We created `t()` and `tn()` functions to be able to pepper them throughout the app, so we could handle translation and plural.

In the server we simply have [Apache's mod_proxy](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html) acting as a reverse proxy for localhost's *[nodemon](https://npmjs.org/package/nodemon)* daemon, running inside a `screen`. And we have out app!


# Genghis, MongoDB admin app

If you are wondering why we didn't talk about edit forms or interface, it's because there aren't any. As the website data is pretty unchanged, and there is no need for the end-user to edit data, we looked into phpMyAdmin alike apps for MongoDB. [Genghis app](http://genghisapp.com) has proven to be the hassless, simple, lightweight tool we needed. In the end, all we need is to edit a few JSONs, since the actual data on fires is processed by a bunch of scritps and should not be overriden.

Yet another easy win, and still using the right tool for the right job. Simples!


# Conclusion

It's been a good learning process, as a first production app powered by Node.js, and we achieved everything we proposed to:
- map-oriented visualisation platform
- internal API to hook up to any other tools (e.g. Highcharts)
- responsive layout
- fast and lightweight

Now the app is set in stone, it can only grow!
