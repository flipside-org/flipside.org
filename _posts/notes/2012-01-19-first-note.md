---
layout: note
title: Redes MIS
category: note

user: danielfdsilva
---
###The Problem
To be able to add and remove respondents form a survey call list we used VBO. This allowed us to show a list with all the respondents, select and add them to the survey call list.
This was being done with drupal actions.

But the problems didn't take long to appear. When the action was called, all the selected respondents were loaded and passed to it and this brought problem on the loading times. We thought of using actions' own ability to handle single object request. In this way a progress bar was shown and the respondents were processed one by one but it didn't give us enough freedom to handle how the information was shown to the user (process titles, messages...)
An there was even other problems. Since we had a lot of data to show we used views with a pager. This approach led to problems with vbo and actions. When showing a confirmation form we needed to print all the selected respondents but, even if we had selected all the respondents in all pages, vbo would only load the respondents equal to the number of items set on the pager.
We decided to discard vbo and build our custom solution. And that's where the fun starts.

###The Solution
We implemented our own actions in our own way.
We created the two pages that we needed: ```node/%node/assign``` and ```node/%node/call-list```. These pages will show a multi-step form. The first step is always the general form, showing the item list and the action selection box, and the following step or steps will depend on the action.
The actions have their own implementation. First an action must be declared in the ```_aw_callcenter_actions```, and they are grouped according to their use.

{% highlight php %}
function _aw_callcenter_actions($group){
  $actions = array(
    'respondents_add' => array(
        '_aw_callcenter_respondent_add_direct' => t('Add selected respondents'),
        '_aw_callcenter_respondent_add_random' => t('Add random respondents from selection'),
      ),
    'respondents_manage' => array(
        '_aw_callcenter_respondent_remove' => t('Remove selected respondents'),
        '_aw_callcenter_call_task_assign' => t('Assign call task to operator'),
        '_aw_callcenter_call_task_unassign' => t('Unassign call task'),
        '_aw_callcenter_call_task_divide' => t('Divide selected call tasks among operators'),
    )  
  );  
  return $actions[$group];  
}
{% endhighlight %}

After declaring the action two function must be created. Each action will have a function with its name and another one with ```_confirm``` appended. For example:

```
function _aw_callcenter_respondent_remove_confirm(&$form_state)
```

```
function _aw_callcenter_respondent_remove(&$form_state)
```

After selecting the action from the dropdown and submitting the form the action_confirm function will be called. Here we create our confirmation form and return it so it's displayed. And we are now at step 2. When we submit this form, if there aren't more steps (more on this later), the form is submitted and the action function is called. The only thing this function does is set the batch (The batch is set using the normal drupal procedure) that will do the processing, in this case deleting the relation between the respondent and the survey.

```
function _aw_callcenter_respondent_remove(&$form_state){
  $survey_node = $form_state['storage']['survey_node'];
  // Use an indexed array instead of using nids as keys
  $rids = array_values($form_state['storage']['rows']);  
  _aw_callcenter_batch_start(t('Removing Respondents'), '_aw_callcenter_batch_respondent_remove', array($rids, $survey_node));
}
```

There are some cases where we need more than 2 steps. The action for adding random respondents from a selection is one of these examples.
Step 1 is the general form, in step 2 we prompt the user about how many respondents should be randomized and in step 3 we show a final confirmation form.

This was easy to accomplish, we just created a multi-step form inside the action_confirm function. The step number is stored in ```$form_state['storage']['step']``` and with a switch we return all the different forms.

```
$step = $form_state['storage']['step'];
switch ($step) {
  case 2:
  //...
    break;
  case 3:
  //...
  break;
}
```

One important thing to keep in mind is the ```$form_state['storage']['more_steps']``` variable. We needed to set it to ```TRUE``` in every step as long as we wanted more steps. On the last step it must be set to ```FALSE```.

Since we have a form with several steps we needed to have some validation. This function  doesn't exist for every action and is not mandatory but once we create it will be fired on every step starting on the second one.
To create it we just appended _validate to the action [1]. Ex: function ```_aw_callcenter_respondent_add_random_validate($form, &$form_state)```.
This function works like the _confirm one. If we need to validate additional steps we use a switch. After all the steps are completed the main action is called and there we set the batch to process everything.

To summarize the general flow:

![General flow of survey call list actions in Airwolf](assets/images/survey-call-list-actions-flow.jpg)

Using this approach we can control exactly what's happening, show a progress bar to the user, and cut down those long loading times since we are only querying the database for what we need.

[1]: This is not as linear as it sound. The main function, in this case function ```aw_callcenter_respondent_add_form($form, &$form_state, $form_action, $node)```, takes care of handling everything, calling each function when it's supposed to do so. Here we just explain how we flow works. NOTE: Right now the main function is only able to handle 3 steps. If more are required, the main switch needs to be adjusted.