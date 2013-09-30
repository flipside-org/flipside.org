---
layout: note
notes_active : true

title: Apache Solr Field Collection and text fields
category: note
image: search-index-view-mode.png
tags: 
  - drupal
  - solr
  - field collection

user: danielfdsilva

---

On a recent Drupal project we used Apache Solr to power the site's search. Besides that we also used [Field Collection](https://drupal.org/project/field_collection), a nifty little module that allows us to have a field, to which any number of fields can be attached, something to the likes of Entity Reference.

To make the two play together nicely, we used the [Apache Solr Field Collection](https://drupal.org/project/apachesolr_field_collection) module to get the fields in the field collection indexed. Everything was going well, but when we started searching we noticed that text fields in the field collection were not being indexed while everything else was.

Text fields get automatically indexed as part of the node's content instead of being indexed as individual fields as happens with taxonomy fields for example. By default the referenced entities (like field collection) don't get rendered as part of the content but fortunately this can be changed.

<div class="image-with-caption eleven columns alpha omega">
  <img src="/images/notes/search-index-view-mode.png" class="nine columns offset-by-one inset-by-one border alpha omega" alt="Search index view mode" />
  <span>Search Index view mode</span>
</div>

The Search Index display mode, which you'll probably need to enable, allows us to define which fields should be rendered as part of the node's content. Once the these fields are defined we just need to re-index the content and we'll be able to search for values in the field collection.