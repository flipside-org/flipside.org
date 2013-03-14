---
layout: note
title: Managing Relations with JQuery sortable
category: drupal, relation

user: danielfdsilva
---
For Drupal 7 there are several contributed modules that allow you to relate entities like References and Entityreference. Though these are stable and mature modules, we've have been using the [Relation](http://www.drupal.org/relation) module for a couple of projects with great success.  
Relations are separate entities, fieldable out of the box and allow you to build pretty complex relations. While it provides several ways for users to create these relations, it is mainly an API module and the provided methods might not always fit the use case for a particular project. This blog post explains how we use JQuery Sortable to work with Relation, allowing users to relate content types through an intuitive drag and drop interface.

![Managing relations through drag and drop](/images/notes/rearrange.png)

The custom module we created for our project has two main functions: (1) adding and sorting the questions; and (2) editing the fields of the particular relation. In this post we'll explain how the adding and sorting of the questions can be done. The second part, which would allow you to, for example, mark question A as required for survey Z but not for survey X, will be subject of a future blog post.

##Basic setup
[JQuery sortable + link to documentation]
[EXPLAIN YOU NEED TWO VIEWS] + CLASSES
one will act as a x, the other as x

##Adding and sorting

The first step is to get a listing of all the available questions and the questions already added to the survey. This was done very easily with views. Next we implemented the jquery plugin which, thanks to jquery's documentation, was also easy. [INSTEAD, PROVIDE LINK TO JQUERY DOCUMENTATION] After the user adds or reorders a question the save button appears allowing the user to save the current status.

```question[]=14&question[]=12&question[]=17```

The node id of the survey and serialized version (above) of the questions listing is sent to a page for processing and we know that the question with the id 14 is the first, the id 12 is the second and so on, allowing us to easily set the order.
However there's a variation to this behavior. If the question is already related to the survey the relation id will be sent in the serialization to ease the update process. It will look something like this: question[]=XX-YY (XX-> Id question, YY-> Id relation)

Now let's peak under the hood to see what's going on. [ADD CODE]
The first thing the module does is to figure out which relations (survey question) are to be added, to be updated and to be removed.

The relations to be updated are the ones with the relation id in the serialization, so those are easy to find out. The remaining questions in the serialization are the ones whose relation needs to be created. The tricky part was to find out the relations to be deleted. To accomplish this we load all the existing relations for that survey and match them against the ones in the serialization. Those we don't find in the serialization are deleted. Simple as that

Now, using the functions provided by the relation module, relation_load(), relation_create(), relation_save(), relation_delete(), we do whatever we need to.



In our custom module, we also allow the user 
[INSERT: SPEAKERDECK PRESENTATION]