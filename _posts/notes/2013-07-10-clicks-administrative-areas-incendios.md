---
layout: note
notes_active : true

title: Incendios.pt - Clicks and administrative areas
category: note
image: incendios-pt-administrative-areas.png
tags: incendios.pt mapbox

user: danielfdsilva
---

The main section of the [incendios.pt](http://incendios.pt) website is the explore section. To allow users to switch between administrative areas more easily we allowed click events on the map. Everytime a user clicks on a specific administrative area type, like District, Municipality, or Parish, its page is shown. This improves the speed of the exploration since the users don't need to drill down using the selectors.

Tilemill (the program we used to build the maps) allows us to set a location to which the user is redirected upon click on a feature, which can be a point, a polygon, etc. But, in our case, this basic functionality was not enough. Our goal was to allow a redirection to a different administrative area type (District, Municipality, Parish) based on the zoom level.

The visible administrative areas change according with the zoom level. From minimum zoom level to zoom level 9 the Districts are visible, from 10 to 12 the Municipalities are visible and from 13 onwards Parishes can be viewed.  
<div class="eleven columns alpha omega">
  <img src="/images/notes/incendios-pt-administrative-areas.png" class="nine columns offset-by-one inset-by-one border alpha omega" alt="Explore data by location" />
</div>

So, according to the visible administrative area type, we wanted a different redirection. This conditional  location couldn't be done in tilemill, so we did it through javascript when including the map in the website.

{% highlight javascript %}
// Include the map.
var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14}).setView([40, -7.5], 6);
{% endhighlight %}

Since all the tiles that compose the maps are rasterized, mapbox uses a [UTFGrid](http://www.mapbox.com/developers/utfgrid/) to allow interactivity with certain points or areas of a map.  
Through this layer we can control how our click will behave.  
The map click will always fire on the Parishes because they are the last element in the ```District > Municipality > Parish``` stack. When the click event occurs, mapbox will make available all the data we entered in tilemill about that parish which will contain its id (More on this in the section Note about INE).

{% highlight javascript %}
// *** Layer. Grid of administrative borders. Used for interactivity.
var grid_layer = L.mapbox.gridLayer('flipside.pt-admin-areas');

// Setup the interactivity.
// When the user clicks...
grid_layer.on('click', function(data){
  if (typeof data.data == 'undefined') {
    //Nothing to do here!
    return;
  }

  // The data.data object contains all the data about the clicked region.
  // The data.data.AAID is the ine of our clicked freguesia.
  // Now, based on the zoom level we extract the portion of the aaid (ine) that interests us.
  if (map.getZoom() <= 9) {
    // Distrito.
    // Ex: Full ine: 110506
    var destination = data.data.AAID.substring(0,2);
    // Ex: destination = 11
  }
  else if (map.getZoom() >= 10 && map.getZoom() <= 12) {
    // Concelho.
    // Ex: Full ine: 110506
    var destination = data.data.AAID.substring(0,4);
    // Ex: destination = 1105
  }
  else {
    // Freguesia.
    // Ex: Full ine: 110506
    var destination = data.data.AAID;
    // Ex: destination = 110506
  }

  // Take the language into account by using Incendios.page_meta.lang
  window.location.href = '/' + Incendios.page_meta.lang + '/por/' + destination;
});

// Add layer to map.
map.addLayer(grid_layer);
{% endhighlight %}

###Note about INE
Every administrative area in Portugal as an id which is called ine. This is a number which can have 2, 4 or 6 digits and it takes into account the value of the parent. For example:

| District  |  Municipality	 |  Parish  |
|:---------:|:--------------:|:--------:|
|  Lisboa		|    Cascais		 |  Estoril |
|    11		  |      05			   |    04    |

The ine for Lisboa is 11  
The ine for Cascais is 1105  
The ine for Estoril is 110504  
