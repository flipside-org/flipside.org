---
layout: note
notes_active : true
filters: guide

title: Apache Solr Field Collection and text fields
category: note
image: search-index-view-mode.png
tags: 
  - drupal
  - solr
  - field collection

user: danielfdsilva

---

For a recent Drupal project, we used [Field Collection](https://drupal.org/project/field_collection), a nifty little module that makes fields fieldable, and Apache Solr to power the site's search. To make the two play together nicely, the [Apache Solr Field Collection](https://drupal.org/project/apachesolr_field_collection) module makes sure that all the fields in the field collection are indexed for the search.

The setup seems pretty straight-forward, but when we started searching we noticed that text fields in the field collection were not being indexed while everything else was. The fix for this issue, though simple, was not that obvious.

{% include content_img.html path="notes/search-index-view-mode.png" caption="Search index view mode" %}

The Search Index display mode, which you can enable per content type, allows you to define which fields should be rendered as part of the node's content. Once these fields are defined you just need to re-index the content to be able to search for values in the field collection.