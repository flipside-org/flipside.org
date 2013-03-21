---
layout: note
title: Managing Relations with JQuery sortable
category: drupal, relation

user: danielfdsilva
---
For Drupal 7 there are several contributed modules like References and Entityreference, that allow you to relate entities. Though these are stable and mature modules, we've have been using the [Relation](http://www.drupal.org/relation) module for a couple of projects with great success.  
Relations are separate entities, fieldable out of the box and allow you to build pretty complex relations. While it provides several ways for the end user to create these relations, it is mainly an API module and the provided methods might not always fit the use case for a particular project. This blog post explains how we use JQuery Sortable to allow users to relate Questions to a Survey through an intuitive drag and drop interface.

##Basic setup
To set up the sorting of questions we need a basic structure, in this case we'll use two separate Views. One view will show a listing of all the questions already added to the survey (left side of the image) and the other will show all the available questions in our repository (right side). For jQuery sortable to work, it is important that the Format of both views is set to a List.

![Managing relations through drag and drop](/images/notes/rearrange.png)

The [jQuery Ui sortable plugin](http://jqueryui.com/sortable/) will handle the sorting but we need to add some classes to the views to make them visible to it. Each view will need its own unique class and a common class to relate them. In our project we use ```survey-questions``` for the survey's questions listing, ```available-questions``` for the question repository and ```connect-sortable``` as the common linking class.

When configuring the views, it's also important to define a 'No results behaviour' to make sure that there is always a drop target, even when the view returns no result. In our example we add a Global text field with the following value ```<li class="empty">No questions were added to this survey yet.</li>```.

To be able to use the jQuery sortable library, we need to include it in our module. Since the library is already in the Drupal core, we just activate it by adding the following code to our page generator function:

{% highlight php %}
drupal_add_library('system', 'ui.sortable');
{% endhighlight %}

##Adding and sorting
With the basic structure set up, we can enable the sortable plugin on both lists. The snippet below show a basic instantiation on the plugin.

{% highlight javascript %}
$( ".survey-questions, .available-questions" ).sortable({
  // We only want to allow dragging with a handle so we specify its class.
  handle : '.li-drag',
  // Specify which items should be draggable.
  // We want all list items except the empty placeholder.
  items: "li:not(.empty)",
  // This little line is what allows us to drag items from one list to another,
  // that's why this class must be set in both views. Without it we would have
  // two useless self reorderable lists. 
  connectWith: ".connect-sortable"
{% endhighlight %}

##Saving data
That's the basic setup in order to make the lists sortable. Now we need a way to save the changes that can occur in three flavors:

1. A question is added to the survey list, i.e., the survey-questions list receives an item.
2. A question is removed from the survey list, i.e., the available-questions list receives an item.
3. The questions are re-ordered in the survey
 
Using the jQuery sortable event callback we can capture these changes and show a save button.

{% highlight javascript %}
$( ".survey-questions, .available-questions" ).sortable({
  // Show the save button when either one of the lists receive a list item.
  receive : function(event, ui ){
    if ($( "input[name=Save]" ).is(":hidden")) {
      $( "input[name=Save]" ).show();
      $(".message-changes").removeClass('hidden');
    }
  }
{% endhighlight %}
{% highlight javascript %}
$( ".survey-questions" ).sortable({
  // Show the save button when the survey-questions list is reordered.
  update : function(event, ui ){
    if ($( "input[name=Save]" ).is(":hidden")) {
      $( "input[name=Save]" ).show();
      $(".message-changes").removeClass('hidden');
    }
  }
});
{% endhighlight %}

###New questions
After clicking on the save button, the node id of the survey and a serialized version of the questions (```question[]=14&question[]=12&question[]=17```) is sent to a page for processing. Through the serialization we know that the question with id 14 is the first, id 12 is the second and so on, allowing us to easily set the order.

###Deal with existing relations
It is also possible, however, that a user makes changes to a survey with already existing questions. In this case, we add the relation ID in the serialization to ease the update process. It will look something like ```question[]=nid-rid```, where ```nid``` is the node ID of the question and ```rid``` the relation ID. The final look of the serialization will be something like: ```question[]=14-50&question[]=12-45&question[]=17```

###Under the hood
The first thing we do is find out which relations (of type survey_question) are to be added, which to be updated and which to be removed.

The relations to be updated are the ones with the relation id in the serialization, so those are easy to find out. The remaining questions in the serialization are the ones whose relation needs to be created.  
The tricky part is to find out the relations to be deleted. To accomplish this we load all the existing relations for that survey and match them against the ones in the serialization. Those we don't find in the serialization are deleted.

{% highlight php %}
// Stores the relations to be created, updated and deleted.
$relations["insert"] = array();
$relations["update"] = array();
$relations["delete"] = array();

// Parses the form serialization saving it in $temp.
parse_str($questionsSerialized, $temp);
// Stores the questions Ids in an Array
$questionsId = $temp["question"];

// If $questionsId is empty, that means that all the questions where removed.
// Remove all the relations related to the survey
if (empty($questionsId)) {
  // Get the ids of the survey_question relations for the given survey.
  $relations["delete"] = _aw_utils_question_sortable_get_relation_id($relationType, $node->nid);

  if (!empty($relations["delete"])) {
    relation_delete_multiple($relations["delete"]);
  }
}
else {
  // Loop through all the questions checking which ones are to be deleted and to
  // be inserted.
  foreach ($questionsId as $order => $id) {

    // The $id comes in the format questionId-relationId
    // if the question is new the relation won't exist and the $id will only
    // contain the questionId.
    // 
    // Split the id and count the values
    // if 1 - the question is new therefore to be inserted
    // if 2 - the relation already exists so update
    // else throw error
    $splitted = explode("-", $id);
    $splittedLength = count($splitted);

    if ($splittedLength == 1) {
      // Question to insert (relation to create)
      // When we are inserting the array key is the order
      // and the value is the questionId.
      $relations["insert"][$order] = $splitted[0];

    }
    elseif ($splittedLength == 2) {
      // Question to update (relation to update)
      // When we are updating the array key is the new order
      // and the value is the relation id.
      $relations["update"][$order] = $splitted[1];

    }
    else {
      // Malformed id.
      // Throw error.
    }
  }

  // We already have the relations to update and insert
  // now get the existing relations to know which ones to delete
  $existingRelations = _aw_utils_question_sortable_get_relation_id($relationType, $node->nid);

  // We can use the $relations["update"] to check the differences between
  // the submitted and existing relations.
  // Since all the existing relations are always updated, the ones not present
  // in the $relations["update"] are to be deleted.
  $relations["delete"] = array_diff($existingRelations, $relations["update"]);
{% endhighlight %}

Now, using the functions provided by the relation module, relation_load(), relation_create(), relation_save(), relation_delete(), we can handle all the data present in our $relation array.

{% highlight php %}
// OPERATIONS - insert, update, delete
// Delete
if (!empty($relations["delete"])) {
  relation_delete_multiple($relations["delete"]);
}

// Insert.
foreach ($relations["insert"] as $order => $id) {
  // Specify endpoints.
  $endpoints = array(
    array(
      'entity_type' => $entityType,
      'entity_id' => $nid
    ),
    array(
      'entity_type' => $entityType,
      'entity_id' => $id
    )
  );

  // Creating the relation.
  $relation = relation_create($relationType, $endpoints);
  $relation->field_relation_order[LANGUAGE_NONE][0]['value'] = $order;
  relation_save($relation));

}// End foreach insert.

// Update
foreach ($relations["update"] as $order => $rid) {
  // Load the relation.
  $relation = relation_load($rid);
  $relation->field_relation_order[LANGUAGE_NONE][0]['value'] = $order;
  relation_save($relation));

}// End foreach update.
{% endhighlight %}

In this example we focused on Adding and Sorting the questions. More advanced features such as editing fields of the relations might be part of a future blog post. We leave you with the slides of a presentation made during the Drupal meetup at [Liberdade 229](http://www.liberdade229.com), last February.

<script class="speakerdeck-embed" data-id="8ff13e90747101306f181231392d8723" data-ratio="0.707182320441989" src="//speakerdeck.com/assets/embed.js"></script>
